import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { introspectCanonicalCatalog } from './schema-catalog.mjs';

const PROJECT = 'tinubu-achievement-stg';
const SERVICE = 'tat-staging';
const LOCATION = 'us-central1';
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const firebaseCli = fileURLToPath(
  new URL('../../node_modules/firebase-tools/lib/bin/firebase.js', import.meta.url),
);

// `dataconnect:sql:diff` is the Firebase CLI's display-only comparison command.
// This audit intentionally never invokes sql:migrate, deploy, or any write API.
const result = spawnSync(process.execPath, [
  firebaseCli,
  'dataconnect:sql:diff',
  '--service', SERVICE,
  '--location', LOCATION,
  '--project', PROJECT,
], {
  cwd: repoRoot,
  encoding: 'utf8',
  maxBuffer: 20 * 1024 * 1024,
});

if (result.error) throw result.error;
if (result.status !== 0) {
  throw new Error(`SQL Connect display-only diff failed with exit ${result.status}: ${result.stderr}`);
}

const plan = `${result.stdout}\n${result.stderr}`
  .replace(/\u001b\[[0-9;]*m/g, '')
  .replace(/\r\n/g, '\n');

if (!plan.includes('PostgreSQL schema is incompatible with the SQL Connect Schema.')) {
  throw new Error('Expected the known SQL Connect incompatibility marker, but it was absent.');
}

const schemaSql = await readFile(new URL('../../database/schema.sql', import.meta.url), 'utf8');
const local = new PGlite();
let canonical;
try {
  await local.exec(schemaSql);
  canonical = await introspectCanonicalCatalog(local);
} finally {
  await local.close();
}

const constraintByKey = new Map(
  canonical.constraints.map((item) => [`${item.table}.${item.name}`, item]),
);

const normalizeColumns = (value) => value
  .replaceAll('"', '')
  .split(',')
  .map((column) => column.trim().toLowerCase())
  .join(',');

const canonicalForeignKeyShape = (constraint) => {
  const columns = constraint.definition.match(/foreign key \(([^)]+)\)/)?.[1];
  const target = constraint.definition.match(/references (?:public\.)?"?([a-z0-9_]+)"?\s*\(([^)]+)\)/);
  if (!columns || !target) {
    throw new Error(`Unable to parse canonical FK ${constraint.table}.${constraint.name}`);
  }
  return {
    columns: normalizeColumns(columns),
    referencedTable: target[1],
    referencedColumns: normalizeColumns(target[2]),
  };
};

const tableBlocks = [];
const blockPattern = /\/\*\* Destructive: modify "([^"]+)" table\*\/\s*ALTER TABLE "public"\."[^"]+"\s*([\s\S]*?)(?=\n\n\/\*\*|$)/g;
for (const match of plan.matchAll(blockPattern)) {
  const table = match[1];
  const body = match[2];
  const droppedNames = [...body.matchAll(/DROP CONSTRAINT "([^"]+)"/g)].map((item) => item[1]);
  const droppedConstraints = droppedNames.map((name) => {
    const constraint = constraintByKey.get(`${table}.${name}`);
    if (!constraint) throw new Error(`Diff dropped unknown canonical constraint ${table}.${name}`);
    return constraint;
  });
  const addedForeignKeys = [...body.matchAll(
    /ADD CONSTRAINT "([^"]+)" FOREIGN KEY \(([^)]+)\) REFERENCES "public"\."([^"]+)" \(([^)]+)\) ON DELETE (CASCADE|SET NULL|SET DEFAULT|RESTRICT|NO ACTION)/g,
  )].map((item) => ({
    name: item[1],
    columns: normalizeColumns(item[2]),
    referencedTable: item[3],
    referencedColumns: normalizeColumns(item[4]),
    deleteAction: item[5],
  }));
  tableBlocks.push({ table, droppedConstraints, addedForeignKeys });
}

const droppedChecks = [];
const droppedUniques = [];
const droppedPrimaryKeys = [];
const foreignKeyRewrites = [];

for (const block of tableBlocks) {
  for (const constraint of block.droppedConstraints) {
    if (constraint.kind === 'c') droppedChecks.push(constraint);
    if (constraint.kind === 'u') droppedUniques.push(constraint);
    if (constraint.kind === 'p') droppedPrimaryKeys.push(constraint);
    if (constraint.kind !== 'f') continue;

    const shape = canonicalForeignKeyShape(constraint);
    const replacement = block.addedForeignKeys.find((candidate) => (
      candidate.columns === shape.columns
      && candidate.referencedTable === shape.referencedTable
      && candidate.referencedColumns === shape.referencedColumns
    ));
    if (!replacement) {
      throw new Error(`No replacement found for canonical FK ${constraint.table}.${constraint.name}`);
    }
    foreignKeyRewrites.push({
      table: constraint.table,
      columns: shape.columns,
      referencedTable: shape.referencedTable,
      canonicalConstraint: constraint.name,
      canonicalDeleteAction: constraint.deleteAction,
      proposedConstraint: replacement.name,
      proposedDeleteAction: replacement.deleteAction,
    });
  }
}

const createdIndexes = [...plan.matchAll(
  /\/\*\* Destructive: create index "([^"]+)" to table: "([^"]+)"\*\/\s*CREATE\s+(UNIQUE\s+)?INDEX/g,
)].map((item) => ({ table: item[2], name: item[1], unique: Boolean(item[3]) }));

const droppedIndexes = [...plan.matchAll(
  /\/\*\* Destructive: drop index "([^"]+)" from table: "([^"]+)"\*\//g,
)].map((item) => {
  const canonicalIndex = canonical.indexes.find((index) => index.table === item[2] && index.name === item[1]);
  if (!canonicalIndex) throw new Error(`Diff dropped unknown canonical index ${item[2]}.${item[1]}`);
  return {
    table: item[2],
    name: item[1],
    unique: canonicalIndex.unique,
    predicate: canonicalIndex.predicate,
    definition: canonicalIndex.definition,
  };
});

const groupConstraints = (constraints) => Object.values(constraints.reduce((groups, constraint) => {
  groups[constraint.table] ??= { table: constraint.table, count: 0, names: [] };
  groups[constraint.table].count += 1;
  groups[constraint.table].names.push(constraint.name);
  return groups;
}, {})).sort((a, b) => a.table.localeCompare(b.table));

const destructiveBlockCount = [...plan.matchAll(/\/\*\* Destructive:/g)].length;
const dropConstraintClauseCount = [...plan.matchAll(/DROP CONSTRAINT /g)].length;
const addForeignKeyClauseCount = [...plan.matchAll(/ADD CONSTRAINT "[^"]+" FOREIGN KEY/g)].length;
const alterColumnClauseCount = [...plan.matchAll(/ALTER COLUMN /g)].length;
const extensionInstalls = [...plan.matchAll(/CREATE EXTENSION IF NOT EXISTS "([^"]+)"/g)].map((item) => item[1]);
const createdUniqueIndexes = createdIndexes.filter((index) => index.unique);
const createdRelationIndexes = createdIndexes.filter((index) => !index.unique);

const expected = {
  tableBlocks: 27,
  destructiveBlocks: 129,
  droppedConstraints: 214,
  droppedChecks: 128,
  droppedUniques: 33,
  droppedPrimaryKeys: 0,
  foreignKeyRewrites: 53,
  droppedIndexes: 4,
  createdIndexes: 98,
  createdUniqueIndexes: 33,
  createdRelationIndexes: 65,
  alterColumnClauses: 0,
};
const actual = {
  tableBlocks: tableBlocks.length,
  destructiveBlocks: destructiveBlockCount,
  droppedConstraints: dropConstraintClauseCount,
  droppedChecks: droppedChecks.length,
  droppedUniques: droppedUniques.length,
  droppedPrimaryKeys: droppedPrimaryKeys.length,
  foreignKeyRewrites: foreignKeyRewrites.length,
  droppedIndexes: droppedIndexes.length,
  createdIndexes: createdIndexes.length,
  createdUniqueIndexes: createdUniqueIndexes.length,
  createdRelationIndexes: createdRelationIndexes.length,
  alterColumnClauses: alterColumnClauseCount,
};
const mismatches = Object.entries(expected)
  .filter(([key, value]) => actual[key] !== value)
  .map(([key, value]) => `${key}: expected ${value}, found ${actual[key]}`);
if (mismatches.length) throw new Error(`Recovered diff metrics changed:\n- ${mismatches.join('\n- ')}`);

console.log(JSON.stringify({
  command: `firebase dataconnect:sql:diff --service ${SERVICE} --location ${LOCATION} --project ${PROJECT}`,
  mode: 'display-only diff; no sql:migrate or deploy invocation',
  validation: 'COMPATIBLE',
  actual,
  extensionInstalls,
  droppedCheckConstraintsByTable: groupConstraints(droppedChecks),
  droppedUniqueConstraintsByTable: groupConstraints(droppedUniques),
  droppedPrimaryKeys,
  foreignKeyRewrites: foreignKeyRewrites.sort((a, b) => (
    a.table.localeCompare(b.table) || a.canonicalConstraint.localeCompare(b.canonicalConstraint)
  )),
  droppedIndexes: droppedIndexes.sort((a, b) => a.name.localeCompare(b.name)),
  createdUniqueIndexes: createdUniqueIndexes.sort((a, b) => (
    a.table.localeCompare(b.table) || a.name.localeCompare(b.name)
  )),
  createdRelationIndexes: createdRelationIndexes.sort((a, b) => (
    a.table.localeCompare(b.table) || a.name.localeCompare(b.name)
  )),
  preservedBecauseAbsentFromPlan: {
    canonicalCascadeForeignKeys: canonical.constraints.filter(
      (item) => item.kind === 'f' && item.deleteAction === 'CASCADE',
    ).length,
    triggers: canonical.triggers.map((item) => `${item.table}.${item.name}`),
    functions: canonical.functions.map((item) => item.name),
    views: canonical.views.map((item) => item.name),
    nonDroppedSpecialIndexes: canonical.indexes
      .filter((item) => (item.predicate
        || item.definition.includes(' using gin ')
        || /\([^)]*\([^)]*\)/.test(item.definition))
        && !droppedIndexes.some((dropped) => dropped.name === item.name))
      .map((item) => `${item.table}.${item.name}`),
  },
}, null, 2));
