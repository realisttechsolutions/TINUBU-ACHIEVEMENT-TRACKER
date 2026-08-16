import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Admin Security Boundary & Client Bundle Isolation (Mission 10E)', () => {
  it('ensures firebase-admin is never referenced in client components or client libraries', () => {
    const clientDirs = [
      path.resolve(__dirname, '../../components'),
      path.resolve(__dirname, '../../views'),
      path.resolve(__dirname, '../../lib/auth'),
    ];

    for (const dir of clientDirs) {
      if (!fs.existsSync(dir)) continue;

      const files = fs.readdirSync(dir, { recursive: true }) as string[];
      for (const file of files) {
        if (typeof file === 'string' && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
          const fullPath = path.join(dir, file);
          const content = fs.readFileSync(fullPath, 'utf-8');

          // Must not import firebase-admin in client paths
          expect(content).not.toContain("from 'firebase-admin'");
          expect(content).not.toContain('from "firebase-admin"');
          expect(content).not.toContain("require('firebase-admin')");
        }
      }
    }
  });

  it('ensures server-only is declared in all server security files', () => {
    const serverFiles = [
      path.resolve(__dirname, '../../lib/server/firebase-admin.ts'),
      path.resolve(__dirname, '../../lib/server/session.ts'),
      path.resolve(__dirname, '../../lib/server/admin-guard.ts'),
      path.resolve(__dirname, '../../lib/server/csrf.ts'),
    ];

    for (const file of serverFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        expect(content).toContain("import 'server-only'");
      }
    }
  });
});
