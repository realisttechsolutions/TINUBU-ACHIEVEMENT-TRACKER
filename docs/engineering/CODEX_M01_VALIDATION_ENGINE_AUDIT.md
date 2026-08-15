# Codex Mission 01 Validation Engine Audit

**Final verdict:** **CONDITIONAL PASS after audit correction.** The baseline validator's success result was not evidence of row/schema validation. The audit repaired the validator and independently confirmed positive and negative behavior. The underlying JSON schemas still require contract revision.

## Baseline behavior at `348a5a7`

The original `scripts/validate-research-foundation.mjs`:

- imported AJV only through an undeclared transitive dependency
- instantiated AJV compatible with Draft-07 and compiled all 18 schemas
- counted 18 schemas and 18 CSV files
- parsed only the first non-empty data row with a permissive custom line parser
- compared header count with row count
- searched each whole CSV for a non-production marker
- exited non-zero for errors it actually detected
- checked only absolute `file:///...md` links and ignored ordinary relative Markdown links

It did **not**:

- validate CSV rows against the compiled schema functions
- verify non-empty required field values
- reject invalid schema enums in rows
- validate most dates or date precision
- validate URLs except at schema compilation time (which validates no data)
- validate identifiers, currencies or decimal precision
- validate pipe-delimited items
- reject quotes inside unquoted fields
- validate every row or embedded newline/escaped-quote structure robustly

The heading said “30 files”, the array actually contained 31 files, and the repository contains 37 Markdown files under `docs/research` (31 canonical correction-pass documents plus six earlier overlapping documents).

## Baseline negative test

A reversible mutation of `achievement_record.csv` introduced all of the following while preserving 24 columns and a non-production marker:

- invalid identifier and slug
- quote inside an unquoted field
- invalid implementation and publication statuses
- blank required classification
- invalid dates
- invalid URLs
- malformed pipe-delimited values

The baseline `npm run validate:research` exited **0** and reported success. The row was immediately restored with no residual diff. This disproves compliance-matrix claims 24 and 52 as originally worded.

## Corrections made

- Declared direct `ajv` `^8.17.1` development dependency and updated the lockfile.
- Corrected required-document count/output to 31.
- Required every schema to declare Draft-07 and compiled all 18 with AJV.
- Added strict full-file CSV parsing with escaped quotes, quoted commas/newlines, CRLF handling, duplicate header detection, illegal quote detection and unclosed quote rejection.
- Required one matching schema per template and exact schema/header coverage.
- Validated every data row with its compiled AJV schema.
- Checked required fields for non-blank values.
- Added HTTP(S) URL, identifier, ISO currency, positive financial decimal, counts, percentages, confidence, year, boolean and pipe-array checks.
- Added calendar-valid exact dates plus month, quarter, year, fiscal-year and range reporting values, including date-precision consistency.
- Required a non-production marker in every data row.
- Checked relative and absolute Markdown file links.
- Preserved non-zero process exit on any failure.

## Post-correction tests

| Test | Expected | Actual |
|---|---|---|
| Untouched foundation | Exit 0 | Exit 0; 31 docs, 18 schemas, 18 templates passed |
| Invalid enum + blank required + invalid ID/date/URL/pipe values | Non-zero | Exit 1 with explicit failures |
| Invalid currency `NZZ`, amount `1.234`, quarter `2024-Q5`, URL | Non-zero | Exit 1 with four explicit failures |
| Quote in unquoted field | Non-zero | Exit 1 at parser offset |
| Restored foundation after tests | Exit 0, no fixture diff | Exit 0; tracked template rows restored |

No destructive fixture or audit-only invalid row remains.

## Draft-07 and schema limitations

AJV now genuinely validates rows, but AJV cannot enforce rules absent from the schemas. Remaining contract gaps include:

- most date properties lack JSON Schema format/pattern rules
- programme/project statuses and several type fields are unconstrained strings
- identifier patterns are absent from most ID fields
- numeric-or-string unions allow formatted or ambiguous numeric inputs
- `claim_extraction.source_id` encodes one source per claim
- financial classes and beneficiary stages are incomplete
- `verification_status` is unconstrained in observation schema
- geographic and reporting-period structures are flat strings
- schemas cannot validate relational foreign keys, uniqueness, duplicate/circular sources, review separation or cross-row financial/beneficiary semantics

The validator adds safe format checks for the current interchange files, but the canonical fix is schema/contract version 1.1 plus relational validation during dry run—not endless validator-specific rules.

## Dependency-install result

`npm install` completed with exit 0 and no initial worktree changes. It reported 28 dependency vulnerabilities: 3 low, 5 moderate, 19 high and 1 critical. No automatic audit fix was run because it could introduce unrelated/breaking dependency changes and was not part of this audit's allowed corrections.

Installing direct AJV changed `package.json` and `package-lock.json`. The Node/npm versions were `v24.12.0` and `11.6.2`.

## Broader checks

| Command | Result | Interpretation |
|---|---|---|
| `npm run validate:research` | PASS | Corrected validator, 0 errors. |
| `npm run typecheck` | UNAVAILABLE | No script named `typecheck`. |
| `npx tsc --noEmit` | Wrapper failure | Windows npm shim resolved outside repo because the workspace path contains `&`. |
| Direct local `tsc --noEmit` | PASS | TypeScript exit 0. |
| `npm run lint` | Wrapper failure | Same npm-shim/workspace-path issue before ESLint ran. |
| Direct local ESLint | FAIL | 13 errors and 10 warnings in pre-existing frontend/config files; no engineering audit doc or validator lint error. |
| `npm run test -- --run` | Wrapper failure | Same npm-shim/workspace-path issue before Vitest ran. |
| Direct local Vitest run | PASS | 6 files, 26 tests. |
| `npm run build` | Wrapper failure | Same npm-shim/workspace-path issue before Vite ran. |
| Direct local Vite build | PASS with warning | 3,491 modules; large `index` chunk warning (>500 kB) and stale Browserslist data notice. |

The direct invocations used the exact installed local package entry points and did not bypass project configuration.

## Final validation decision

The engine is now fit to guard the existing example templates, but Research Mission 01 cannot receive final contract approval until the JSON schemas and canonical vocabularies are revised. Add automated validator unit/fixture tests in the next mission so negative behavior is preserved in CI rather than relying on manual audit mutations.
