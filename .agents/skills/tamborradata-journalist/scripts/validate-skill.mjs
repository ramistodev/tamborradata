#!/usr/bin/env node
// Valida la estructura de la habilidad sin dependencias externas.
// Uso: node scripts/validate-skill.mjs

import { existsSync, lstatSync, readdirSync, readFileSync, readlinkSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSql } from './check-sql-readonly.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = root.split(sep).pop();
const repoRoot = resolve(root, '..', '..', '..');
const problems = [];
const notes = [];
const fail = (message) => problems.push(message);
const rel = (path) => relative(root, path).split(sep).join('/');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const skillPath = join(root, 'SKILL.md');
const requiredModules = [
  'references/editorial-philosophy.md',
  'references/narrative-writing.md',
  'references/article-structure.md',
  'references/investigation-process.md',
  'references/supabase-readonly.md',
  'references/statistical-verification.md',
  'references/data-visualization.md',
  'references/editorial-review.md',
  'references/publishing-workflow.md',
  'references/style-examples.md',
  'references/claude-link-fallback.md',
  'assets/article-template.md',
  'assets/evidence-ledger-template.md',
  'scripts/check-sql-readonly.mjs',
  'scripts/sync-skill.mjs',
  'scripts/tests/sql-guard.check.mjs',
];

for (const module of requiredModules) {
  if (!existsSync(join(root, module))) fail(`falta el módulo requerido: ${module}`);
}

if (!existsSync(skillPath)) {
  fail('falta SKILL.md');
} else {
  const text = readFileSync(skillPath, 'utf8').replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match) {
    fail('SKILL.md debe empezar en la línea 1 con frontmatter YAML');
  } else {
    const fields = Object.fromEntries(
      match[1]
        .split('\n')
        .map((line) => /^([a-z][\w-]*):\s*(.*)$/.exec(line))
        .filter(Boolean)
        .map((parts) => [parts[1], parts[2]]),
    );
    if (fields.name !== name) fail(`name debe ser ${name}`);
    if (!fields.description || !/^".*"$/.test(fields.description)) {
      fail('description debe ser una línea entre comillas');
    }
    if (fields.description?.length > 250) fail('description supera 250 caracteres');
    if (!fields.license) fail('falta license');
  }
  const words = text.replace(/^---[\s\S]*?---\s*/, '').trim().split(/\s+/).length;
  notes.push(`cuerpo de SKILL.md: ${words} palabras`);
  if (words >= 700) fail('el cuerpo de SKILL.md debe tener menos de 700 palabras');
}

const markdown = walk(root).filter((path) => path.endsWith('.md'));
const directLinks = new Set();
const linkPattern = /\[[^\]]*\]\(([^)\s]+)\)/g;
for (const file of markdown) {
  const text = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
  for (const match of text.matchAll(linkPattern)) {
    const target = match[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const absolute = resolve(dirname(file), target.split('#')[0]);
    if (!existsSync(absolute)) fail(`enlace roto en ${rel(file)}: ${target}`);
    if (file === skillPath) directLinks.add(rel(absolute));
  }
}
for (const module of requiredModules.filter((path) => path.endsWith('.md'))) {
  if (!directLinks.has(module)) fail(`${module} debe estar enlazado directamente desde SKILL.md`);
}

let sqlBlocks = 0;
for (const file of markdown) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/```sql\n([\s\S]*?)```/g)) {
    sqlBlocks++;
    const result = checkSql(match[1]);
    if (!result.ok) fail(`ejemplo SQL rechazado en ${rel(file)}: ${result.errors.join('; ')}`);
  }
}
notes.push(`ejemplos SQL comprobados: ${sqlBlocks}`);

const mirror = join(repoRoot, '.claude', 'skills', name);
const expectedTarget = '../../.agents/skills/tamborradata-journalist';
try {
  if (!lstatSync(mirror).isSymbolicLink()) fail('el espejo de Claude debe ser un enlace simbólico');
  else if (readlinkSync(mirror) === expectedTarget) notes.push('enlace simbólico relativo de Claude: correcto');
  else if (resolve(dirname(mirror), readlinkSync(mirror)) === root) {
    notes.push('unión NTFS de fallback de Claude: correcta');
  } else fail(`destino del enlace inválido: debe ser ${expectedTarget}`);
} catch {
  fail(`falta el enlace simbólico .claude/skills/${name}`);
}

for (const note of notes) console.log(`  ${note}`);
if (problems.length) {
  console.error(`\n${problems.length} problema(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`\n${name}: válido`);
