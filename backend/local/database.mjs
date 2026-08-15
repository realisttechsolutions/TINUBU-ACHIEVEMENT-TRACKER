import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export async function readRepositoryFile(relativePath) {
  return readFile(path.join(repositoryRoot, relativePath), 'utf8');
}

export async function createLocalDatabase({ seed = true } = {}) {
  const db = new PGlite();
  await db.exec(await readRepositoryFile('database/schema.sql'));
  if (seed) {
    await db.exec(await readRepositoryFile('database/fixtures/synthetic-e01.sql'));
  } else {
    await db.exec(await readRepositoryFile('database/seeds/canonical-reference.sql'));
  }
  return db;
}

export async function runQueryFile(db, fileName, params = []) {
  const sql = await readRepositoryFile(path.posix.join('database/queries', fileName));
  return db.query(sql, params);
}