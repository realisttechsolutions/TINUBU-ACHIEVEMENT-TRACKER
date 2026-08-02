# Research Agent Operating Model — Tinubu Achievement Tracker V2

This document defines the 11 multi-agent roles and operating rules.

---

## 1. The 11 Operating Roles
1. `Research Planner`: Defines scope & questions.
2. `Source Discovery Agent`: Finds source leads.
3. `Source Capture Agent`: Logs bibliographic metadata.
4. `Claim Extraction Agent`: Extracts atomic assertions.
5. `Entity Resolution Agent`: Matches entities & MDAs.
6. `Verification Agent`: Audits sources & dates.
7. `Reconciliation Agent`: Resolves duplicates & contradictions.
8. `Schema & QA Agent`: Validates JSON schema & CSV formatting.
9. `Editorial Agent`: Drafts public copy adhering to 13 Truth Rules.
10. `Human Reviewer`: Senior editor sign-off.
11. `Data Publisher`: Exports staging batches for Supabase.

---

## 2. Inviolable Rule
Single AI agents MUST NOT independently discover, verify, and approve High or Critical risk records without independent QA check and human editorial sign-off.
