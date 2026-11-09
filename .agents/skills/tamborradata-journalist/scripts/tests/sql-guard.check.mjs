import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkSql } from '../check-sql-readonly.mjs';

const ok = (sql) => {
  const r = checkSql(sql);
  assert.equal(r.ok, true, `expected OK, got errors: ${r.errors.join(' | ')}\n${sql}`);
  return r;
};
const bad = (sql, fragment) => {
  const r = checkSql(sql);
  assert.equal(r.ok, false, `expected rejection:\n${sql}`);
  if (fragment) {
    assert.ok(
      r.errors.some((e) => e.toLowerCase().includes(fragment.toLowerCase())),
      `expected an error containing "${fragment}", got: ${r.errors.join(' | ')}`,
    );
  }
};

test('accepts a plain aggregate SELECT', () => {
  ok('SELECT year, count(*) AS n FROM participants GROUP BY year ORDER BY year');
});

test('accepts a read-only CTE', () => {
  ok(`WITH p AS (SELECT id FROM stats_periods WHERE is_ready) SELECT count(*) FROM p`);
});

test('accepts a trailing semicolon and comments', () => {
  ok('-- how many periods\nSELECT count(*) /* all */ FROM stats_periods;');
});

test('ignores forbidden words inside string literals', () => {
  ok(`SELECT count(*) FROM statistics WHERE category = 'delete update insert'`);
});

test('rejects every write statement', () => {
  bad(`INSERT INTO schools(canonical_name) VALUES ('x')`, 'must start');
  bad(`UPDATE schools SET canonical_name = 'x'`, 'must start');
  bad(`DELETE FROM participants`, 'must start');
  bad(`DROP TABLE participants`, 'must start');
  bad(`CREATE TABLE t(a int)`, 'must start');
  bad(`ALTER TABLE schools ADD COLUMN x int`, 'must start');
  bad(`TRUNCATE participants`, 'must start');
  bad(`MERGE INTO schools s USING x ON true WHEN MATCHED THEN DELETE`, 'must start');
  bad(`GRANT ALL ON schools TO anon`, 'must start');
  bad(`COPY participants TO '/tmp/x'`, 'must start');
  bad(`DO $$ BEGIN DELETE FROM participants; END $$`, 'must start');
});

test('rejects data-modifying CTEs', () => {
  bad(`WITH d AS (DELETE FROM participants RETURNING *) SELECT * FROM d`, 'delete');
  bad(`WITH i AS (INSERT INTO schools(canonical_name) VALUES ('x') RETURNING *) SELECT * FROM i`, 'insert');
  bad(`WITH u AS (UPDATE schools SET canonical_name='x' RETURNING *) SELECT * FROM u`, 'update');
});

test('rejects SELECT INTO and row-locking clauses', () => {
  bad('SELECT * INTO new_table FROM schools', 'into');
  bad('SELECT * FROM schools FOR UPDATE', 'update');
  bad('SELECT * FROM schools FOR SHARE', 'for share');
});

test('rejects stacked statements', () => {
  bad('SELECT 1; DELETE FROM participants', 'multiple statements');
  bad('SELECT 1; SELECT 2', 'multiple statements');
});

test('rejects functions with side effects', () => {
  bad(`SELECT nextval('seq')`, 'nextval');
  bad(`SELECT setval('seq', 1)`, 'setval');
  bad(`SELECT set_config('role', 'postgres', false)`, 'set_config');
  bad(`SELECT pg_sleep(30)`, 'pg_sleep');
  bad(`SELECT pg_terminate_backend(123)`, 'pg_terminate_backend');
  bad(`SELECT pg_advisory_lock(1)`, 'pg_advisory');
  bad(`SELECT lo_import('/etc/passwd')`, 'lo_import');
  bad(`SELECT pg_read_file('/etc/passwd')`, 'pg_read_file');
  bad(`SELECT * FROM dblink('host=x', 'select 1') AS t(a int)`, 'dblink');
});

test('rejects sensitive schemas', () => {
  bad('SELECT * FROM auth.users', 'auth');
  bad('SELECT * FROM vault.secrets', 'vault');
  bad('SELECT * FROM storage.objects', 'storage');
  bad('SELECT * FROM "auth"."users"', 'auth');
});

test('rejects empty input and comment-only input', () => {
  bad('', 'empty');
  bad('-- nothing here', 'empty');
});

test('tricks with comments or case do not bypass the guard', () => {
  bad('SeLeCt 1; dElEtE FROM participants', 'multiple statements');
  bad('SELECT /* x */ * FROM schools FoR uPdAtE', 'update');
  bad('WITH x AS (SELECT 1) /* ; */ DELETE FROM participants', 'delete');
});

test('rejects raw participant records, even with a LIMIT', () => {
  bad('SELECT name, year FROM participants LIMIT 5', 'participant-level');
  bad('SELECT * FROM participants', 'participant-level');
  bad('SELECT resolution FROM participant_name_resolutions LIMIT 5', 'participant-level');
});

test('rejects direct identifiers but accepts aggregate investigations', () => {
  bad('SELECT id, count(*) FROM participants GROUP BY id', 'direct identifier');
  ok('SELECT id FROM stats_periods LIMIT 1');
  bad('SELECT participant_id, count(*) FROM participants GROUP BY participant_id', 'direct identifier');
  bad('SELECT full_name FROM participants LIMIT 1', 'direct identifier');
  ok('SELECT year, count(*) FROM participants GROUP BY year');
  ok('SELECT normalized_name, count(*) FROM participant_name_resolutions GROUP BY normalized_name');
  ok('SELECT count(DISTINCT participant_id) FROM participants');
});

test('warns when a query has neither LIMIT nor aggregation', () => {
  const r = ok('SELECT entity_label, rank FROM statistic_ranks');
  assert.ok(r.warnings.some((w) => w.toLowerCase().includes('limit')));
});
