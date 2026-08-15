# Tinubu Achievement Tracker — Research Mission 01 Compliance Matrix v1.1.2

**Evaluation Date:** 2026-08-15

**Governing Contract:** `TAT_RESEARCH_CONTRACT_V1_1_2.md`

**Evidence Rule:** This matrix contains the actual individually evaluated checks. It does not inherit or imply the retired “90/90” or “100%” claims. A PASS is limited to the evidence named in that row.

## Summary

| Category | Individually evidenced checks | PASS | Open |
|---|---:|---:|---:|
| Truth and research scope | 10 | 10 | 0 |
| Authority and vocabulary | 10 | 10 | 0 |
| Schemas and templates | 8 | 8 | 0 |
| Validator and fixtures | 8 | 8 | 0 |
| Governance and document control | 4 | 4 | 0 |
| **Total** | **40** | **40** | **0** |

## Individually evidenced checks

| # | Check | Evidence | Result |
|---:|---|---|:---:|
| 1 | Historical scope is 29 May 2023 through August 2026 | Contract v1.1.2 §1.1 | PASS |
| 2 | Positive selection cannot lower truth standards | Contract v1.1.2 §2 critical rule | PASS |
| 3 | No fabrication or figure inflation | Truth invariants 1–2 | PASS |
| 4 | Reporting periods are preserved | Truth invariant 3 | PASS |
| 5 | Announcement, approval, funding, release, expenditure, completion, and operation remain distinct | Truth invariants 4–9 and implementation statuses | PASS |
| 6 | Targets and applicants are not reported as actual beneficiaries | Truth invariants 10–12 | PASS |
| 7 | Government reporting is distinct from independent verification | Truth invariant 13 | PASS |
| 8 | Qualifications and contradictions are preserved | Truth invariants 14–15 | PASS |
| 9 | Corrections and provenance are preserved | Truth invariants 16–17 | PASS |
| 10 | Historical versions remain immutable | Truth invariant 18 and superseded-file retention | PASS |
| 11 | Contract v1.1.2 is the sole active master | Contract authority header and document index | PASS |
| 12 | Vocabulary v1.1.2 is the sole active machine authority | `authority_status`, prior-registry supersession metadata, validator section 2 | PASS |
| 13 | Exactly 43 controlled namespaces exist | Vocabulary arrays and validator section 2 | PASS |
| 14 | Namespace codes are unique | Validator section 2 duplicate-code checks | PASS |
| 15 | All 15 sector parents resolve to one of 5 public groups | Vocabulary parent check | PASS |
| 16 | Schema enums equal registry enums in both directions | 70 exact mapped enum checks and NEG-01/NEG-02 | PASS |
| 17 | Deprecated aliases are rejected | NEG-03 | PASS |
| 18 | Five independent classification dimensions are explicit | Contract v1.1.2 §4 and classification standard | PASS |
| 19 | Implementation status is separate from the five classifications | Contract v1.1.2 §4–5 | PASS |
| 20 | Source levels, roles, claim types, relationship types, evidence profiles, finance, beneficiaries, dates, events, and geography are registered | Vocabulary v1.1.2 namespaces | PASS |
| 21 | Exactly 19 Draft-07 schemas compile | Validator section 3 | PASS |
| 22 | All schemas reject additional properties | Independent schema structure check in validator baseline | PASS |
| 23 | Exactly 19 matching CSV templates exist | Validator section 4 | PASS |
| 24 | Template headers exactly equal schema property sets | Validator section 4 | PASS |
| 25 | Required values and identifier formats are enforced | Validator section 4; NEG-04/NEG-05 | PASS |
| 26 | Financial type and positive value rules are enforced | Schema/domain checks; NEG-16/NEG-17 | PASS |
| 27 | Beneficiary stage and non-negative count rules are enforced | Schema/domain checks; NEG-18/NEG-19 | PASS |
| 28 | Every row contains the exact non-production marker | Validator section 4; NEG-24 | PASS |
| 29 | All configured date fields match declared precision | Date bindings; NEG-20/NEG-21 | PASS |
| 30 | Period start cannot exceed period end | Validator domain check; NEG-22 | PASS |
| 31 | Sector/public-group row pairing is enforced | Parent check; NEG-23 | PASS |
| 32 | Twenty-four configured FK fields resolve | Validator section 5; NEG-07 through NEG-12 | PASS |
| 33 | Nineteen primary-ID namespaces and global uniqueness are checked | Validator section 5; NEG-06 | PASS |
| 34 | Claim-source composite uniqueness is enforced | Validator section 5; NEG-15 | PASS |
| 35 | One complete positive package passes | POS-01 | PASS |
| 36 | Twenty-five negative fixtures each produce a non-zero error count | Fixture runner summary | PASS |
| 37 | Malformed quoted CSV is rejected | NEG-25 | PASS |
| 38 | Document index exactly equals the research Markdown filesystem | Validator section 1: 44/44, unique | PASS |
| 39 | Active research requirements are implementation-neutral | Contract §14, boundary standard, legacy/deprecated classifications | PASS |
| 40 | Human review below numeric floors includes financial and beneficiary materiality | Contract §12.2 and operating model §3.1 | PASS |

## Closure interpretation

These 40 checks are the defensible Mission 01 closure set implemented in v1.1.2. Dependency vulnerabilities, existing frontend lint findings, bundle-size warnings, and browser-data freshness are engineering backlog items outside this research-integrity matrix.
