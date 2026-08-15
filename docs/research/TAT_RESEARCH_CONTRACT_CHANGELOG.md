# Tinubu Achievement Tracker — Research Contract Changelog through v1.1.2

**Changelog Version:** 1.1.2

**Release Date:** 2026-08-15

**Governing Authority:** Data Governance Directorate & Research Verification Team

## Version authority

| Version | Status | Purpose |
|---|:---:|---|
| v1.1 | SUPERSEDED | Initial consolidated research contract |
| v1.1.1 | SUPERSEDED | First validator/vocabulary remediation |
| v1.1.2 | CANONICAL | Final Mission 01 closure and frozen implementation contract |

## Version 1.1.2 final closure changes

1. Published `TAT_RESEARCH_CONTRACT_V1_1_2.md` as the sole active master contract and `canonical-vocabulary.v1.1.2.json` as the sole active machine registry.
2. Marked both prior contracts and vocabularies SUPERSEDED while preserving their immutable history.
3. Defined five independent classification dimensions: data value nature, source origin, verification status, workflow status, and publication status. Implementation status remains separate.
4. Enforced exact schema/registry enum equality in both directions for 70 mapped enum properties; one boolean-string enum is explicitly local.
5. Added configured precision checks for achievement, beneficiary, claim, finance, indicator observation, policy, programme, project, source, and timeline date fields.
6. Added row-level public-group/sector parent validation.
7. Added 24 configured foreign-key bindings, including duplicate-review and relationship-supersession references.
8. Added uniqueness checks for 19 primary-ID namespaces, global primary identifiers, and the five-part claim-source relationship composite.
9. Replaced the fixture suite with one complete positive package and 25 negative fixtures that each produce a non-zero error count.
10. Reconciled the document index exactly to all 44 research Markdown files and their five allowed statuses.
11. Retired or historicalized active Supabase/RLS wording; backend mechanisms remain engineering responsibilities.
12. Added qualitative financial and beneficiary materiality triggers below numeric escalation floors.
13. Replaced the unsupported 90/90 matrix with 40 individually evidenced checks.
14. Narrowed validator PASS messages to the checks actually executed.

## Version 1.1.1 historical changes

Version 1.1.1 introduced the 43-domain vocabulary content, 19 paired schemas/templates, the many-to-many claim-source relationship, baseline FK checks, exact example marker, 18 truth safeguards, and implementation-neutral boundary language. The final Codex audit found that several validator and registry claims were broader than their implementation. Version 1.1.2 closes those specific gaps.

## Version 1.1 historical changes

Version 1.1 consolidated the record taxonomy, status model, evidence standards, source roles, finance/beneficiary distinctions, governance gates, and research roadmap. Its implementation-specific backend wording and incomplete vocabulary are historical only.

## Frozen-version rule

Version 1.1.2 is frozen for implementation. A later research-contract version requires a genuinely fundamental integrity defect, not an optional improvement or engineering preference.
