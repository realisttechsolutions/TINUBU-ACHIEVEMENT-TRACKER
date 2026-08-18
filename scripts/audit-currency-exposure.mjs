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

const currencyMatches = [];

for (const filePath of files) {
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // Check for USD / US$ / Dollar
    const usdMatch = line.match(/\bUSD\b/i);
    const usDollarMatch = line.match(/US\$/i);
    const wordDollarMatch = line.match(/\bdollars?\b/i);
    const dollarSignComponent = line.match(/\bDollarSign\b/);

    // Check for monetary dollar sign (e.g. $10, $38.5, $1B, etc.)
    // Exclude template literals `${` and SQL placeholders `$1` in queries
    const monetaryDollarMatches = line.match(/\$(?:\d|[A-Za-z])/g);
    // Filter out template literals `${` which have `{` after `$`
    let hasMonetaryDollar = false;
    if (monetaryDollarMatches) {
      // check if it's not purely ${ or SQL param $1 in tests
      const strippedTemplate = line.replace(/\$\{[^}]*\}/g, '');
      if (strippedTemplate.includes('$')) {
        hasMonetaryDollar = true;
      }
    }

    if (usdMatch || usDollarMatch || wordDollarMatch || dollarSignComponent || hasMonetaryDollar) {
      currencyMatches.push({
        file: relPath,
        line: lineNum,
        content: line.trim(),
        types: {
          usd: !!usdMatch,
          usDollar: !!usDollarMatch,
          wordDollar: !!wordDollarMatch,
          dollarSignComponent: !!dollarSignComponent,
          monetaryDollar: hasMonetaryDollar
        }
      });
    }
  });
}

console.log(JSON.stringify(currencyMatches, null, 2));
console.log(`\nTotal matched lines: ${currencyMatches.length}`);
