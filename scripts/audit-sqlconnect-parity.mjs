import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
import { readRepositoryFile } from '../backend/local/database.mjs';

const columnSql = `
  SELECT c.relname AS table_name, a.attnum, a.attname AS column_name,
         pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
         NOT a.attnotnull AS nullable,
         pg_get_expr(ad.adbin, ad.adrelid) AS column_default
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped
  LEFT JOIN pg_attrdef ad ON ad.adrelid = c.oid AND ad.adnum = a.attnum
  WHERE n.nspname = 'public' AND c.relkind = 'r'
  ORDER BY c.relname, a.attnum`;

const constraintSql = `
  SELECT c.relname AS table_name, con.contype AS constraint_type,
         pg_get_constraintdef(con.oid) AS definition
  FROM pg_constraint con
  JOIN pg_class c ON c.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND con.contype IN ('p', 'u', 'f')
  ORDER BY c.relname, con.contype, definition`;

const uniqueIndexSql = `
  SELECT c.relname AS table_name,
         'unique (' || array_to_string(ARRAY(
           SELECT pg_get_indexdef(i.indexrelid, key_position, TRUE)
           FROM generate_series(1, i.indnkeyatts) AS key_position
         ), ', ') || ')' AS definition,
         pg_get_expr(i.indpred, i.indrelid) AS predicate
  FROM pg_index i
  JOIN pg_class c ON c.oid = i.indrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND i.indisunique AND NOT i.indisprimary
  ORDER BY c.relname, definition`;

const postgresOnlySql = `
  SELECT 'index' AS object_type, tablename AS parent_name, indexname AS object_name, indexdef AS definition
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND (indexdef ILIKE '% WHERE %' OR indexdef ILIKE '% USING gin %' OR indexdef ~ '\\([^)]*\\([^)]*\\)')
  UNION ALL
  SELECT 'check', c.relname, con.conname, pg_get_constraintdef(con.oid)
  FROM pg_constraint con
  JOIN pg_class c ON c.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND con.contype = 'c'
  UNION ALL
  SELECT 'trigger', c.relname, t.tgname, pg_get_triggerdef(t.oid)
  FROM pg_trigger t
  JOIN pg_class c ON c.oid = t.tgrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND NOT t.tgisinternal
  UNION ALL
  SELECT 'view', table_name, table_name, 'public SQL projection'
  FROM information_schema.views
  WHERE table_schema = 'public'
  ORDER BY object_type, parent_name, object_name`;

const normalizeDefault = (value) => value == null ? null : value
  .toLowerCase()
  .replaceAll('::text', '')
  .replaceAll('::jsonb', '')
  .replace(/^\((.*)\)$/, '$1')
  .replace(/\s+/g, ' ')
  .trim();

const normalizeDefinition = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();

async function introspect(client) {
  const { rows: columns } = await client.query(columnSql);
  const { rows: constraints } = await client.query(constraintSql);
  const { rows: uniqueIndexes } = await client.query(uniqueIndexSql);
  return {
    columns: columns.map((row) => ({
      table: row.table_name,
      position: Number(row.attnum),
      column: row.column_name,
      type: row.data_type.toLowerCase(),
      nullable: row.nullable,
      default: normalizeDefault(row.column_default),
    })),
    constraints: constraints.map((row) => ({
      table: row.table_name,
      kind: row.constraint_type,
      definition: normalizeDefinition(row.definition),
    })),
    uniqueIndexes: uniqueIndexes.map((row) => ({
      table: row.table_name,
      definition: normalizeDefinition(row.definition),
      predicate: row.predicate == null ? null : normalizeDefinition(row.predicate),
    })),
  };
}

function rowsByKey(rows, keyFn) {
  return new Map(rows.map((row) => [keyFn(row), row]));
}

function compareRows(expectedRows, actualRows, keyFn, fields) {
  const expected = rowsByKey(expectedRows, keyFn);
  const actual = rowsByKey(actualRows, keyFn);
  const missing = [...expected.keys()].filter((key) => !actual.has(key)).map((key) => expected.get(key));
  const extra = [...actual.keys()].filter((key) => !expected.has(key)).map((key) => actual.get(key));
  const mismatched = [];
  for (const [key, expectedRow] of expected) {
    const actualRow = actual.get(key);
    if (!actualRow) continue;
    const differences = fields.filter((field) => expectedRow[field] !== actualRow[field]);
    if (differences.length) mismatched.push({ key, differences, expected: expectedRow, actual: actualRow });
  }
  return { missing, extra, mismatched };
}

const local = new PGlite();
const emulator = new pg.Client({
  host: process.env.TAT_SQLCONNECT_HOST ?? '127.0.0.1',
  port: Number(process.env.TAT_SQLCONNECT_PORT ?? 5432),
  database: process.env.TAT_SQLCONNECT_DATABASE ?? 'tat_staging',
  user: process.env.TAT_SQLCONNECT_USER ?? 'postgres',
  ssl: false,
});

try {
  await local.exec(await readRepositoryFile('database/schema.sql'));
  await emulator.connect();
  const canonical = await introspect(local);
  const generated = await introspect(emulator);
  const { rows: postgresOnly } = await local.query(postgresOnlySql);

  const columnComparison = compareRows(
    canonical.columns, generated.columns,
    (row) => `${row.table}.${row.column}`,
    ['type', 'nullable', 'default'],
  );
  const columnOrderDifferences = canonical.columns.flatMap((expected) => {
    const actual = generated.columns.find((row) => row.table === expected.table && row.column === expected.column);
    return actual && actual.position !== expected.position
      ? [{ table: expected.table, column: expected.column, expected: expected.position, actual: actual.position }]
      : [];
  });
  const constraintComparison = compareRows(
    canonical.constraints.filter((row) => row.kind !== 'u'),
    generated.constraints.filter((row) => row.kind !== 'u'),
    (row) => `${row.table}.${row.kind}.${row.definition.replace(/ on delete (cascade|set null|restrict|no action)/g, '')}`,
    ['definition'],
  );
  const canonicalUniqueConstraints = canonical.constraints
    .filter((row) => row.kind === 'u')
    .map(({ table, definition }) => ({ table, definition, predicate: null }));
  const generatedDeclaredUniques = generated.uniqueIndexes.filter((row) => row.predicate == null);
  const uniqueComparison = compareRows(
    canonicalUniqueConstraints, generatedDeclaredUniques,
    (row) => `${row.table}.${row.definition}`,
    ['predicate'],
  );
  const canonicalTables = new Set(canonical.columns.map((row) => row.table));
  const generatedTables = new Set(generated.columns.map((row) => row.table));
  const missingTables = [...canonicalTables].filter((table) => !generatedTables.has(table));
  const extraTables = [...generatedTables].filter((table) => !canonicalTables.has(table));
  const report = {
    canonicalTableCount: canonicalTables.size,
    generatedTableCount: generatedTables.size,
    missingTables,
    extraTables,
    columnComparison,
    columnOrderDifferences,
    constraintComparison,
    uniqueComparison,
    postgresOnlyObjects: postgresOnly,
  };

  const columnIssueCount = columnComparison.missing.length + columnComparison.extra.length + columnComparison.mismatched.length;
  const constraintIssueCount = constraintComparison.missing.length + constraintComparison.extra.length + constraintComparison.mismatched.length;
  const uniqueIssueCount = uniqueComparison.missing.length + uniqueComparison.extra.length + uniqueComparison.mismatched.length;
  console.log(`Canonical tables: ${canonicalTables.size}; SQL Connect tables: ${generatedTables.size}`);
  console.log(`Column semantic issues: ${columnIssueCount}; compiler-only column order differences: ${columnOrderDifferences.length}`);
  console.log(`Unique-key semantic issues: ${uniqueIssueCount}; Data Connect physical form: unique indexes`);
  console.log(`PK/FK issues: ${constraintIssueCount} (missing ${constraintComparison.missing.length}, extra ${constraintComparison.extra.length}, mismatched ${constraintComparison.mismatched.length})`);
  console.log(`Preserved PostgreSQL-only objects in canonical DDL: ${postgresOnly.length}`);
  const postgresOnlyCounts = postgresOnly.reduce((counts, row) => {
    counts[row.object_type] = (counts[row.object_type] ?? 0) + 1;
    return counts;
  }, {});
  console.log(`PostgreSQL-only breakdown: ${Object.entries(postgresOnlyCounts).map(([kind, count]) => `${kind}=${count}`).join(', ')}`);
  const quiet = process.argv.includes('--quiet');
  if (columnIssueCount && !quiet) {
    console.log('Column semantic mismatch keys:');
    for (const row of columnComparison.mismatched) console.log(`- ${row.key}: ${row.differences.join(', ')}`);
    for (const row of columnComparison.missing) console.log(`- missing ${row.table}.${row.column}`);
    for (const row of columnComparison.extra) console.log(`- extra ${row.table}.${row.column}`);
  }
  if (constraintIssueCount && !quiet) {
    console.log('Constraint mismatch keys:');
    for (const row of constraintComparison.mismatched) console.log(`- ${row.key}: ${row.expected.definition} <> ${row.actual.definition}`);
    for (const row of constraintComparison.missing) console.log(`- missing ${row.table}: ${row.definition}`);
    for (const row of constraintComparison.extra) console.log(`- extra ${row.table}: ${row.definition}`);
  }
  if (uniqueIssueCount && !quiet) {
    console.log('Unique-key mismatch keys:');
    for (const row of uniqueComparison.missing) console.log(`- missing ${row.table}: ${row.definition}`);
    for (const row of uniqueComparison.extra) console.log(`- extra ${row.table}: ${row.definition}`);
  }
  if (process.argv.includes('--matrix')) {
    console.log('| Table | Columns | Primary key | Unique rules | FKs | Generated FK action gaps |');
    console.log('|---|---:|---|---:|---:|---:|');
    for (const table of [...canonicalTables].sort()) {
      const primaryKey = canonical.constraints.find((row) => row.table === table && row.kind === 'p')?.definition ?? 'none';
      const uniqueCount = canonical.constraints.filter((row) => row.table === table && row.kind === 'u').length;
      const foreignKeyCount = canonical.constraints.filter((row) => row.table === table && row.kind === 'f').length;
      const actionGapCount = constraintComparison.mismatched.filter((row) => row.expected.table === table && row.expected.kind === 'f').length;
      const columnCount = canonical.columns.filter((row) => row.table === table).length;
      console.log(`| \`${table}\` | ${columnCount} | \`${primaryKey}\` | ${uniqueCount} | ${foreignKeyCount} | ${actionGapCount} |`);
    }
  }
  if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
  if (missingTables.length || extraTables.length || columnIssueCount || uniqueIssueCount || constraintIssueCount) process.exitCode = 1;
  else console.log('PASS: SQL Connect-generated physical schema matches canonical columns, PKs, unique constraints, and FKs');
} finally {
  await Promise.allSettled([local.close(), emulator.end()]);
}
