const normalize = (value) => value == null
  ? null
  : String(value)
    .toLowerCase()
    .replace(/"public"\./g, 'public.')
    .replace(/\s+/g, ' ')
    .trim();

const rows = async (db, sql) => (await db.query(sql)).rows;

export async function introspectCanonicalCatalog(db) {
  // A pg.Client serializes work on one connection. Keep these catalog reads
  // explicitly sequential so the audit remains compatible with pg 9.
  const tables = await rows(db, `
      SELECT c.relname AS table_name
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind = 'r'
      ORDER BY c.relname`);
  const columns = await rows(db, `
      SELECT c.relname AS table_name,
             a.attnum AS position,
             a.attname AS column_name,
             pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
             a.attnotnull AS not_null,
             a.attgenerated AS generated_kind,
             pg_get_expr(ad.adbin, ad.adrelid) AS column_default
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_attribute a ON a.attrelid = c.oid
        AND a.attnum > 0
        AND NOT a.attisdropped
      LEFT JOIN pg_attrdef ad ON ad.adrelid = c.oid AND ad.adnum = a.attnum
      WHERE n.nspname = 'public' AND c.relkind = 'r'
      ORDER BY c.relname, a.attnum`);
  const constraints = await rows(db, `
      SELECT c.relname AS table_name,
             con.conname AS constraint_name,
             con.contype AS constraint_type,
             pg_get_constraintdef(con.oid, true) AS definition,
             CASE con.confdeltype
               WHEN 'a' THEN 'NO ACTION'
               WHEN 'r' THEN 'RESTRICT'
               WHEN 'c' THEN 'CASCADE'
               WHEN 'n' THEN 'SET NULL'
               WHEN 'd' THEN 'SET DEFAULT'
               ELSE NULL
             END AS delete_action
      FROM pg_constraint con
      JOIN pg_class c ON c.oid = con.conrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND con.contype IN ('p', 'u', 'f', 'c')
      ORDER BY c.relname, con.contype, con.conname`);
  const indexes = await rows(db, `
      SELECT tablename AS table_name, indexname AS index_name, indexdef AS definition,
             pg_get_expr(i.indpred, i.indrelid) AS predicate,
             i.indisprimary AS is_primary,
             i.indisunique AS is_unique
      FROM pg_indexes x
      JOIN pg_class ic ON ic.relname = x.indexname
      JOIN pg_namespace ins ON ins.oid = ic.relnamespace AND ins.nspname = x.schemaname
      JOIN pg_index i ON i.indexrelid = ic.oid
      WHERE x.schemaname = 'public'
      ORDER BY x.tablename, x.indexname`);
  const triggers = await rows(db, `
      SELECT c.relname AS table_name,
             t.tgname AS trigger_name,
             p.proname AS function_name,
             pg_get_triggerdef(t.oid, true) AS definition
      FROM pg_trigger t
      JOIN pg_class c ON c.oid = t.tgrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_proc p ON p.oid = t.tgfoid
      WHERE n.nspname = 'public' AND NOT t.tgisinternal
      ORDER BY c.relname, t.tgname`);
  const functions = await rows(db, `
      SELECT p.proname AS function_name,
             pg_get_function_identity_arguments(p.oid) AS identity_arguments,
             pg_get_function_result(p.oid) AS result_type,
             l.lanname AS language,
             p.prokind AS function_kind,
             p.provolatile AS volatility,
             p.prosrc AS source
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      JOIN pg_language l ON l.oid = p.prolang
      WHERE n.nspname = 'public'
      ORDER BY p.proname, pg_get_function_identity_arguments(p.oid)`);
  const views = await rows(db, `
      SELECT c.relname AS view_name, pg_get_viewdef(c.oid, true) AS definition
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind = 'v'
      ORDER BY c.relname`);
  const extensions = await rows(db, `
      SELECT e.extname AS extension_name
      FROM pg_extension e
      ORDER BY e.extname`);

  return {
    tables: tables.map((row) => row.table_name),
    columns: columns.map((row) => ({
      table: row.table_name,
      position: Number(row.position),
      name: row.column_name,
      type: normalize(row.data_type),
      notNull: row.not_null,
      generatedKind: row.generated_kind || '',
      default: normalize(row.column_default),
    })),
    constraints: constraints.map((row) => ({
      table: row.table_name,
      name: row.constraint_name,
      kind: row.constraint_type,
      definition: normalize(row.definition),
      deleteAction: row.delete_action,
    })),
    indexes: indexes.map((row) => ({
      table: row.table_name,
      name: row.index_name,
      definition: normalize(row.definition),
      predicate: normalize(row.predicate),
      primary: row.is_primary,
      unique: row.is_unique,
    })),
    triggers: triggers.map((row) => ({
      table: row.table_name,
      name: row.trigger_name,
      function: row.function_name,
      definition: normalize(row.definition),
    })),
    functions: functions.map((row) => ({
      name: row.function_name,
      arguments: normalize(row.identity_arguments),
      result: normalize(row.result_type),
      language: row.language,
      kind: row.function_kind,
      volatility: row.volatility,
      source: normalize(row.source),
    })),
    views: views.map((row) => ({
      name: row.view_name,
      definition: normalize(row.definition),
    })),
    extensions: extensions.map((row) => row.extension_name),
  };
}

function compareRows(expectedRows, actualRows, keyFn) {
  const expected = new Map(expectedRows.map((row) => [keyFn(row), row]));
  const actual = new Map(actualRows.map((row) => [keyFn(row), row]));
  const missing = [...expected.keys()].filter((key) => !actual.has(key));
  const extra = [...actual.keys()].filter((key) => !expected.has(key));
  const mismatched = [];

  for (const [key, expectedRow] of expected) {
    const actualRow = actual.get(key);
    if (!actualRow || JSON.stringify(expectedRow) === JSON.stringify(actualRow)) continue;
    mismatched.push({ key, expected: expectedRow, actual: actualRow });
  }

  return { missing, extra, mismatched };
}

export function compareCanonicalCatalogs(expected, actual) {
  return {
    tables: compareRows(expected.tables, actual.tables, (value) => value),
    columns: compareRows(expected.columns, actual.columns, (row) => `${row.table}.${row.name}`),
    constraints: compareRows(expected.constraints, actual.constraints, (row) => `${row.table}.${row.name}`),
    indexes: compareRows(expected.indexes, actual.indexes, (row) => `${row.table}.${row.name}`),
    triggers: compareRows(expected.triggers, actual.triggers, (row) => `${row.table}.${row.name}`),
    functions: compareRows(expected.functions, actual.functions, (row) => `${row.name}(${row.arguments})`),
    views: compareRows(expected.views, actual.views, (row) => row.name),
    extensions: compareRows(expected.extensions, actual.extensions, (value) => value),
  };
}

export function catalogMetrics(catalog) {
  const foreignKeys = catalog.constraints.filter((row) => row.kind === 'f');
  const checks = catalog.constraints.filter((row) => row.kind === 'c');
  const uniqueConstraints = catalog.constraints.filter((row) => row.kind === 'u');
  const specialIndexes = catalog.indexes.filter((row) => row.predicate
    || row.definition.includes(' using gin ')
    || /\([^)]*\([^)]*\)/.test(row.definition));

  return {
    tables: catalog.tables.length,
    columns: catalog.columns.length,
    primaryKeys: catalog.constraints.filter((row) => row.kind === 'p').length,
    foreignKeys: foreignKeys.length,
    restrictDeleteActions: foreignKeys.filter((row) => row.deleteAction === 'RESTRICT').length,
    cascadeDeleteActions: foreignKeys.filter((row) => row.deleteAction === 'CASCADE').length,
    // Mission 10A's 33 application uniqueness rules are declared UNIQUE
    // constraints. PostgreSQL-only partial uniqueness remains counted among
    // the eight special indexes rather than being double-counted here.
    uniqueRules: uniqueConstraints.length,
    checkConstraints: checks.length,
    indexes: catalog.indexes.length,
    specialIndexes: specialIndexes.length,
    triggers: catalog.triggers.length,
    functions: catalog.functions.length,
    views: catalog.views.length,
    generatedColumns: catalog.columns.filter((row) => row.generatedKind).length,
    extensions: catalog.extensions,
    postgresOnlyControls: checks.length + specialIndexes.length + catalog.triggers.length + catalog.views.length,
  };
}

export function catalogIssueCount(comparison) {
  return Object.values(comparison).reduce(
    (total, section) => total + section.missing.length + section.extra.length + section.mismatched.length,
    0,
  );
}

export function assertMission10BMetrics(metrics) {
  const expected = {
    tables: 27,
    columns: 372,
    primaryKeys: 27,
    foreignKeys: 65,
    restrictDeleteActions: 53,
    cascadeDeleteActions: 12,
    uniqueRules: 33,
    checkConstraints: 128,
    specialIndexes: 8,
    triggers: 9,
    views: 4,
    postgresOnlyControls: 149,
  };
  const mismatches = Object.entries(expected)
    .filter(([key, value]) => metrics[key] !== value)
    .map(([key, value]) => `${key}: expected ${value}, found ${metrics[key]}`);
  if (mismatches.length) {
    throw new Error(`Mission 10B catalog metrics failed:\n- ${mismatches.join('\n- ')}`);
  }
}
