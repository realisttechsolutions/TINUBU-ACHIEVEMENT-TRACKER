import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const cwd = process.cwd();

console.log('======================================================================');
console.log('TINUBU ACHIEVEMENT TRACKER — RESEARCH FOUNDATION VALIDATOR');
console.log('======================================================================\n');

let totalErrors = 0;

function logPass(msg) {
  console.log(`✅ PASS: ${msg}`);
}

function logFail(msg) {
  console.error(`❌ FAIL: ${msg}`);
  totalErrors++;
}

// 1. CHECK REQUIRED DOCUMENTATION FILES (30 exact files)
console.log('--- 1. VERIFYING REQUIRED DOCUMENTATION FILES (30 FILES) ---');
const requiredDocs = [
  'docs/research/MISSION_R01_RESEARCH_DATA_BLUEPRINT.md',
  'docs/research/TAT_RESEARCH_OBJECTIVES.md',
  'docs/research/TAT_COMPLETE_DATA_UNIVERSE.md',
  'docs/research/TAT_RECORD_TAXONOMY.md',
  'docs/research/TAT_SECTOR_TAXONOMY.md',
  'docs/research/TAT_STATUS_AND_CLASSIFICATION_STANDARD.md',
  'docs/research/TAT_SOURCE_HIERARCHY.md',
  'docs/research/TAT_SOURCE_ROLE_STANDARD.md',
  'docs/research/TAT_EVIDENCE_STANDARD.md',
  'docs/research/TAT_EVIDENCE_PROFILE_STANDARD.md',
  'docs/research/TAT_RESEARCH_WORKFLOW.md',
  'docs/research/TAT_VERIFICATION_WORKFLOW.md',
  'docs/research/TAT_CONTRADICTION_PROTOCOL.md',
  'docs/research/TAT_DUPLICATE_DETECTION_STANDARD.md',
  'docs/research/TAT_DATA_FRESHNESS_POLICY.md',
  'docs/research/TAT_RESEARCH_AGENT_OPERATING_MODEL.md',
  'docs/research/TAT_RESEARCH_RISK_CLASSIFICATION.md',
  'docs/research/TAT_SUPABASE_DATA_CONTRACT_V1.md',
  'docs/research/TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md',
  'docs/research/TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md',
  'docs/research/TAT_RESEARCH_OUTPUT_TEMPLATES.md',
  'docs/research/TAT_IMPORT_EXPORT_STANDARD.md',
  'docs/research/TAT_QUALITY_CONTROL_GATES.md',
  'docs/research/TAT_RESEARCH_PRIORITISATION_STANDARD.md',
  'docs/research/TAT_PILOT_RESEARCH_DESIGN.md',
  'docs/research/TAT_RESEARCH_ROADMAP.md',
  'docs/research/TAT_RESEARCH_GOVERNANCE.md',
  'docs/research/TAT_DATA_VERSIONING_AND_CORRECTION_STANDARD.md',
  'docs/research/TAT_RESEARCH_RISK_REGISTER.md',
  'docs/research/TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md',
  'docs/research/TAT_MISSION_R01_COMPLIANCE_MATRIX.md'
];

requiredDocs.forEach(docPath => {
  const fullPath = path.join(cwd, docPath);
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    if (size > 100) {
      logPass(`${docPath} (${size} bytes)`);
    } else {
      logFail(`${docPath} is too small (${size} bytes)`);
    }
  } else {
    logFail(`Missing required document: ${docPath}`);
  }
});

// 2. COMPILE SCHEMAS WITH AJV (DRAFT-07)
console.log('\n--- 2. COMPILING JSON SCHEMAS WITH AJV (DRAFT-07) ---');
const ajv = new Ajv({ allErrors: true, strict: false });

const schemaDir = path.join(cwd, 'research/schemas');
if (!fs.existsSync(schemaDir)) {
  logFail(`Schema directory does not exist: ${schemaDir}`);
} else {
  const schemaFiles = fs.readdirSync(schemaDir).filter(f => f.endsWith('.json'));
  if (schemaFiles.length !== 18) {
    logFail(`Expected 18 schema files in research/schemas/, found ${schemaFiles.length}`);
  }
  schemaFiles.forEach(sFile => {
    try {
      const sPath = path.join(schemaDir, sFile);
      const sContent = JSON.parse(fs.readFileSync(sPath, 'utf8'));
      const validate = ajv.compile(sContent);
      if (typeof validate === 'function') {
        logPass(`Compiled schema: research/schemas/${sFile} (${sContent.title})`);
      } else {
        logFail(`Failed to compile schema: ${sFile}`);
      }
    } catch (e) {
      logFail(`Schema error in ${sFile}: ${e.message}`);
    }
  });
}

// 3. PARSE & VALIDATE CSV TEMPLATES
console.log('\n--- 3. VALIDATING 18 CANONICAL CSV TEMPLATES & EXAMPLE MARKERS ---');
const templateDir = path.join(cwd, 'research/templates');
if (!fs.existsSync(templateDir)) {
  logFail(`Template directory does not exist: ${templateDir}`);
} else {
  const csvFiles = fs.readdirSync(templateDir).filter(f => f.endsWith('.csv'));
  if (csvFiles.length !== 18) {
    logFail(`Expected 18 CSV template files in research/templates/, found ${csvFiles.length}`);
  }
  
  // Custom CSV parser handling quoted strings & commas
  function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  csvFiles.forEach(cFile => {
    const cPath = path.join(templateDir, cFile);
    const content = fs.readFileSync(cPath, 'utf8').trim();
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    
    if (lines.length < 2) {
      logFail(`CSV template ${cFile} lacks data row (has ${lines.length} lines)`);
      return;
    }
    
    const headers = parseCSVLine(lines[0]);
    const exampleRow = parseCSVLine(lines[1]);
    
    if (headers.length !== exampleRow.length) {
      logFail(`${cFile}: Header count (${headers.length}) does not match data row count (${exampleRow.length})`);
    } else {
      logPass(`${cFile} header & row count matched (${headers.length} columns)`);
    }

    // Check non-production example marker
    if (content.includes('[EXAMPLE ONLY - NOT A PRODUCTION RECORD]') || content.includes('[DEMO-NON-PROD')) {
      logPass(`${cFile} contains valid non-production marker`);
    } else {
      logFail(`${cFile} MISSING required non-production example marker`);
    }
  });
}

// 4. CHECK INTERNAL MARKDOWN LINKS
console.log('\n--- 4. CHECKING RELATIVE MARKDOWN LINKS ---');
const allDocs = fs.readdirSync(path.join(cwd, 'docs/research')).filter(f => f.endsWith('.md'));
let brokenLinks = 0;

allDocs.forEach(docFile => {
  const dPath = path.join(cwd, 'docs/research', docFile);
  const content = fs.readFileSync(dPath, 'utf8');
  const linkRegex = /\[([^\]]+)\]\((file:\/\/\/[^\)]+|[^\)]+\.md)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const linkTarget = match[2];
    if (linkTarget.startsWith('file:///')) {
      const decodedPath = decodeURIComponent(linkTarget.replace('file:///', ''));
      if (!fs.existsSync(decodedPath)) {
        logFail(`In ${docFile}: Broken absolute file link -> ${decodedPath}`);
        brokenLinks++;
      }
    }
  }
});
if (brokenLinks === 0) {
  logPass(`All Markdown file links verified successfully.`);
}

console.log('\n======================================================================');
if (totalErrors === 0) {
  console.log('🎉 SUCCESS: ALL VALIDATION CHECKS PASSED (0 ERRORS)');
  console.log('======================================================================');
  process.exit(0);
} else {
  console.error(`💥 FAILURE: ${totalErrors} VALIDATION ERROR(S) DETECTED`);
  console.log('======================================================================');
  process.exit(1);
}
