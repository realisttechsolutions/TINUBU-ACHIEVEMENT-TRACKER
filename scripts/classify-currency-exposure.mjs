import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(process.cwd(), 'src');

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.js')) {
      results.push(filePath);
    }
  }
  return results;
}

const files = getAllFiles(SRC_DIR);

const classifications = {
  A_PUBLIC_DISPLAY: [],
  B_SOURCE_PROVENANCE: [],
  C_ADMIN_INTERNAL: [],
  D_TEST_FIXTURE: [],
  E_DOCUMENTATION_HISTORICAL: [],
  F_CODE_TOKEN_NON_MONETARY: []
};

for (const filePath of files) {
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Check if line contains any currency indicators or $ signs
    const hasUsd = /\bUSD\b/i.test(line);
    const hasUsDollar = /US\$/i.test(line);
    const hasDollarWord = /\bdollars?\b/i.test(line);
    const hasDollarSignIcon = /\bDollarSign\b/.test(line);

    // Look for $ that is NOT part of ${...}
    const noTemplate = line.replace(/\$\{[^}]*\}/g, '');
    const hasDollar = noTemplate.includes('$');

    if (!hasUsd && !hasUsDollar && !hasDollarWord && !hasDollarSignIcon && !hasDollar) {
      return;
    }

    const item = {
      file: relPath,
      line: lineNum,
      content: trimmed
    };

    // Classify
    if (relPath.includes('__tests__') || relPath.includes('.test.')) {
      classifications.D_TEST_FIXTURE.push(item);
    } else if (relPath.startsWith('src/server/') || relPath.includes('/admin/') || relPath.includes('admin-')) {
      // Check if it's SQL parameter placeholder $1, $2
      if (/SELECT|WHERE|UPDATE|INSERT|\$\d/i.test(trimmed) && !/\$\d+(?:\.\d+)?[MBKmbk]/.test(trimmed)) {
        classifications.F_CODE_TOKEN_NON_MONETARY.push(item);
      } else {
        classifications.C_ADMIN_INTERNAL.push(item);
      }
    } else if (/^\s*(?:\$1|\$2|\$3|\$4|\$5|WHERE|LIMIT|OFFSET|SELECT|ORDER BY|JOIN|RETURNING)\b/i.test(trimmed) || /['"`]\s*(?:SELECT|UPDATE|INSERT|DELETE|WHERE|AND|OR|LIMIT)\s+.*?\$\d/i.test(trimmed)) {
      classifications.F_CODE_TOKEN_NON_MONETARY.push(item);
    } else if (relPath.startsWith('src/data/') || relPath.startsWith('src/adapters/')) {
      // In data / adapter layer
      if (hasUsd || hasDollar || hasDollarWord) {
        // Is it evidence/source/milestone or public feed?
        if (/sources?|evidence|citation|gazette|document|milestone|legislation|act\b/i.test(trimmed) || /claimText|sourceTitle|publisher/i.test(trimmed)) {
          classifications.B_SOURCE_PROVENANCE.push(item);
        } else if (/value:|current:|target:|highlightStat|title:|summary:|expectedOrMeasuredImpact/i.test(trimmed)) {
          classifications.A_PUBLIC_DISPLAY.push(item);
        } else {
          classifications.B_SOURCE_PROVENANCE.push(item);
        }
      } else {
        classifications.F_CODE_TOKEN_NON_MONETARY.push(item);
      }
    } else if (relPath.startsWith('src/views/') || relPath.startsWith('src/components/')) {
      // Public UI components / views
      if (hasDollarSignIcon) {
        classifications.A_PUBLIC_DISPLAY.push({ ...item, note: 'DollarSign Lucide icon' });
      } else if (hasDollar || hasUsd || hasUsDollar || hasDollarWord) {
        classifications.A_PUBLIC_DISPLAY.push(item);
      } else {
        classifications.F_CODE_TOKEN_NON_MONETARY.push(item);
      }
    } else {
      classifications.E_DOCUMENTATION_HISTORICAL.push(item);
    }
  });
}

console.log('=== CURRENCY EXPOSURE CLASSIFICATION SUMMARY ===\n');
for (const [key, list] of Object.entries(classifications)) {
  console.log(`${key}: ${list.length} occurrences`);
}

console.log('\n--- CATEGORY A: PUBLIC DISPLAY CANDIDATES ---');
classifications.A_PUBLIC_DISPLAY.forEach(x => {
  console.log(`[${x.file}:${x.line}] ${x.content} ${x.note ? `(${x.note})` : ''}`);
});

console.log('\n--- CATEGORY B: SOURCE / PROVENANCE MATCHES ---');
classifications.B_SOURCE_PROVENANCE.forEach(x => {
  console.log(`[${x.file}:${x.line}] ${x.content}`);
});

console.log('\n--- CATEGORY C: ADMIN / INTERNAL MATCHES ---');
classifications.C_ADMIN_INTERNAL.forEach(x => {
  console.log(`[${x.file}:${x.line}] ${x.content}`);
});
