import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';

export const repositoryRoot = process.cwd();

export async function readRepositoryFile(relativePath) {
  return readFile(path.resolve(process.cwd(), relativePath), 'utf8');
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