#!/usr/bin/env node
// Defence-in-depth linter for SQL the journalist agent is about to run against Tamborradata.
//
// IT IS NOT A SECURITY BOUNDARY. The boundary is a Supabase MCP server started with
// `read_only=true` and `project_ref=<production>` (see references/supabase-readonly.md).
// This script only catches mistakes before they leave the agent: writes, data-modifying CTEs,
// stacked statements, side-effect functions, sensitive schemas and obvious requests for
// minor-level records. It intentionally is not a SQL parser; see supabase-readonly.md.
//
// Usage:  node check-sql-readonly.mjs "SELECT 1"      |   node check-sql-readonly.mjs --file q.sql
//         echo "SELECT 1" | node check-sql-readonly.mjs
// Exit code: 0 = accepted (warnings possible), 1 = rejected, 2 = usage error.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FORBIDDEN_KEYWORDS = [
  'insert', 'update', 'delete', 'merge', 'truncate', 'drop', 'create', 'alter', 'grant', 'revoke',
  'copy', 'call', 'execute', 'vacuum', 'refresh', 'reindex', 'cluster', 'lock', 'listen', 'notify',
  'into',
];

const FORBIDDEN_FUNCTIONS =
  /\b(nextval|setval|set_config|pg_sleep\w*|pg_advisory\w*|pg_terminate_backend|pg_cancel_backend|pg_read\w*|pg_ls\w*|pg_file\w*|lo_\w+|dblink\w*|pg_notify|pg_reload_conf|pg_rotate_logfile|pg_switch_wal|pg_create\w*|pg_drop\w*|pg_stat_reset\w*|pg_promote)\s*\(/i;

const SENSITIVE_SCHEMAS =
  /\b(auth|vault|storage|realtime|pgsodium|supabase_functions|supabase_migrations|cron)\s*\./i;

const AGGREGATION = /\b(group\s+by|count|sum|avg|min|max|bool_or|bool_and|percentile_cont)\s*(\(|\b)/i;

const PARTICIPANT_TABLES = /\b(participants|participant_name_resolutions)\b/i;
const DIRECT_IDENTIFIERS =
  /\b(?:participant_id|participant_uuid|uuid|full_name|display_name|email|e_mail|phone|telephone|address|dni|nif|passport)\b/i;
// A bare `id` only identifies a minor when the query reads participant tables;
// `stats_periods.id`, `schools.id`, etc. are not personal data.
const BARE_ID = /\bid\b/i;

function selectLists(clean) {
  return [...clean.matchAll(/\bselect\b([\s\S]*?)\bfrom\b/gi)].map((match) => match[1]);
}

function isSafeIdentifierCount(selectList) {
  return selectList.replace(
    /\bcount\s*\(\s*(?:distinct\s+)?(?:[a-z_][\w$]*\.)?(?:id|participant_id|participant_uuid|uuid)\s*\)/gi,
    '',
  );
}

/**
 * Replaces comments and string literals so keyword checks only see real SQL.
 * Quoted identifiers are unquoted (so "auth"."users" is seen as auth.users).
 */
function sanitize(sql) {
  let out = '';
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    const next = sql[i + 1];

    if (c === '-' && next === '-') {
      while (i < sql.length && sql[i] !== '\n') i++;
      out += ' ';
    } else if (c === '/' && next === '*') {
      let depth = 1;
      i += 2;
      while (i < sql.length && depth > 0) {
        if (sql[i] === '/' && sql[i + 1] === '*') {
          depth++;
          i += 2;
        } else if (sql[i] === '*' && sql[i + 1] === '/') {
          depth--;
          i += 2;
        } else i++;
      }
      out += ' ';
    } else if (c === "'") {
      i++;
      while (i < sql.length) {
        if (sql[i] === "'" && sql[i + 1] === "'") i += 2;
        else if (sql[i] === "'") break;
        else i++;
      }
      i++;
      out += "''";
    } else if (c === '$') {
      const m = /^\$([A-Za-z_]\w*)?\$/.exec(sql.slice(i));
      if (m) {
        const end = sql.indexOf(m[0], i + m[0].length);
        i = end === -1 ? sql.length : end + m[0].length;
        out += "''";
      } else {
        out += c;
        i++;
      }
    } else if (c === '"') {
      i++;
      let ident = '';
      while (i < sql.length) {
        if (sql[i] === '"' && sql[i + 1] === '"') {
          ident += '"';
          i += 2;
        } else if (sql[i] === '"') break;
        else ident += sql[i++];
      }
      i++;
      out += ident;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

/** @returns {{ ok: boolean, errors: string[], warnings: string[] }} */
export function checkSql(sql) {
  const errors = [];
  const warnings = [];
  const clean = sanitize(String(sql ?? ''));
  const statements = clean
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  if (statements.length === 0) {
    return { ok: false, errors: ['empty query'], warnings };
  }
  if (statements.length > 1) {
    errors.push('multiple statements are not allowed (one SELECT per call)');
  }

  const first = statements[0].replace(/^[\s(]+/, '');
  if (!/^(select|with)\b/i.test(first)) {
    errors.push('query must start with SELECT or WITH');
  }

  for (const kw of FORBIDDEN_KEYWORDS) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(clean)) {
      errors.push(`forbidden keyword: ${kw.toUpperCase()}`);
    }
  }
  if (/\bfor\s+(no\s+key\s+update|key\s+share|share)\b/i.test(clean)) {
    errors.push('row-locking clause: FOR SHARE / FOR KEY SHARE');
  }

  const fn = FORBIDDEN_FUNCTIONS.exec(clean);
  if (fn) errors.push(`forbidden function: ${fn[1].toLowerCase()}()`);

  const schema = SENSITIVE_SCHEMAS.exec(clean);
  if (schema) errors.push(`sensitive schema is off limits: ${schema[1].toLowerCase()}`);

  const aggregated = AGGREGATION.test(clean);
  if (PARTICIPANT_TABLES.test(clean) && !aggregated) {
    errors.push(
      'participant-level records are not allowed: use GROUP BY or an aggregate and return only aggregate results',
    );
  }
  if (PARTICIPANT_TABLES.test(clean) && /\bselect\s+(?:distinct\s+)?(?:[a-z_][\w$]*\.)?\*\s+from\s+(?:participants|participant_name_resolutions)\b/i.test(clean)) {
    errors.push('participant-level wildcard projection is not allowed');
  }
  for (const selectList of selectLists(clean)) {
    const safeList = isSafeIdentifierCount(selectList);
    const identifier =
      DIRECT_IDENTIFIERS.exec(safeList) ?? (PARTICIPANT_TABLES.test(clean) ? BARE_ID.exec(safeList) : null);
    if (identifier) {
      errors.push(`direct identifier requested in SELECT list: ${identifier[0].toLowerCase()}`);
      break;
    }
  }
  if (!aggregated && !/\blimit\s+\d+/i.test(clean)) {
    warnings.push('no LIMIT and no aggregation: add a LIMIT to avoid pulling large tables');
  }

  return { ok: errors.length === 0, errors, warnings };
}

function main(argv) {
  let sql;
  const fileFlag = argv.indexOf('--file');
  if (fileFlag !== -1) {
    if (!argv[fileFlag + 1]) {
      console.error('usage: check-sql-readonly.mjs [--file query.sql | "SELECT ..."]');
      return 2;
    }
    sql = readFileSync(argv[fileFlag + 1], 'utf8');
  } else if (argv.length > 0) {
    sql = argv.join(' ');
  } else {
    try {
      sql = readFileSync(0, 'utf8');
    } catch {
      console.error('usage: check-sql-readonly.mjs [--file query.sql | "SELECT ..."]');
      return 2;
    }
  }
  const result = checkSql(sql);
  console.log(JSON.stringify(result, null, 2));
  return result.ok ? 0 : 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main(process.argv.slice(2)));
}
