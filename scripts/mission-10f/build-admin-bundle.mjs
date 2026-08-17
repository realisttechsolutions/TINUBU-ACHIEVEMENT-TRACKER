import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const esbuild = require('../../node_modules/esbuild');

console.log('Bundling TAT Admin Control Plane...');
mkdirSync('dist-admin', { recursive: true });

esbuild.buildSync({
  entryPoints: ['src/admin-service/index.ts'],
  outfile: 'dist-admin/index.cjs',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  external: ['pg', '@google-cloud/cloud-sql-connector', 'firebase-admin', 'firebase-admin/app', 'firebase-admin/auth'],
});

const pkg = {
  name: 'tat-admin-api-staging',
  version: '1.0.0',
  private: true,
  main: 'index.cjs',
  dependencies: {
    '@google-cloud/cloud-sql-connector': '^1.11.3',
    'firebase-admin': '^14.2.0',
    'pg': '^8.23.0',
  },
};

writeFileSync('dist-admin/package.json', JSON.stringify(pkg, null, 2));
console.log('dist-admin/index.cjs and dist-admin/package.json created successfully.');
