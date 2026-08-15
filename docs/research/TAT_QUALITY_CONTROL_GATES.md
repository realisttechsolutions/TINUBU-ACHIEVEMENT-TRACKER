# Tinubu Achievement Tracker — Quality Control Gates & Responsibilities (v1.1)

**Standard Version:** 1.1.2
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1.2

---

## 1. Quality Control Architecture: 6 Macro Gates & 10 Responsibilities

Research Contract v1.1 organizes the quality assurance framework into **six sequential macro quality gates** that explicitly preserve and test all **ten core research responsibilities**:

```text
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                  SIX QUALITY CONTROL GATES                                        |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| GATE 0: TASK AUTHORIZATION                                                                        |
|   └── Responsibility 1: Research Task Approval                                                    |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| GATE 1: SOURCE AND CLAIM CAPTURE                                                                  |
|   ├── Responsibility 2: Source Identity Verification                                              |
|   └── Responsibility 3: Atomic Claim Extraction & Location Binding                                |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| GATE 2: ENTITY RESOLUTION AND EVIDENCE RECONCILIATION                                             |
|   ├── Responsibility 4: Entity Resolution & Taxonomy Alignment                                    |
|   └── Responsibility 5: Multi-Source Corroboration & Contradiction Logging                        |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| GATE 3: AUTOMATED DATA READINESS & INTEGRITY CHECK                                                |
|   ├── Responsibility 6: Automated Schema & Vocabulary Validation                                  |
|   └── Responsibility 9: Relational Foreign-Key & Database Readiness                               |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| GATE 4: EDITORIAL GOVERNANCE & HUMAN SIGN-OFF                                                     |
|   ├── Responsibility 7: Editorial 13 Truth Rules Audit & Neutrality Review                         |
|   └── Responsibility 8: Mandatory Human Lead Reviewer Approval                                    |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| GATE 5: PUBLICATION PROJECTION & POST-PUBLICATION STEWARDSHIP                                     |
|   └── Responsibility 10: Post-Publication Freshness, Corrections & Audit Trail                    |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

## 2. Gate-by-Gate Specification

### Gate 0: Task Authorization
- **Preserved Responsibility:** Responsibility 1 (Research Task Approval).
- **Inputs:** Research Task Proposal, target sector, historical timeframe (29 May 2023 - August 2026), preliminary lead URL, assigned researchers.
- **Checks:** Verify research scope falls strictly within administration window; verify no duplicate task is active; assign risk tier (Low, Medium, High, Critical).
- **Responsible Actor:** Research Planner.
- **Exit Evidence:** Signed task authorization manifest with batch ID and assigned risk rating.

### Gate 1: Source and Claim Capture
- **Preserved Responsibilities:** Responsibility 2 (Source Identity) & Responsibility 3 (Claim Extraction).
- **Inputs:** Raw source document, legal gazette, statistical bulletin, or official portal record.
- **Checks:** Confirm source provenance (Levels 1–5); verify document authenticity; capture persistent URL and archive snapshot; extract discrete factual claims with exact locators (`page`, `table`, `section`).
- **Responsible Actors:** Source Discovery Agent, Source Capture Agent, Extraction Agent.
- **Exit Evidence:** Populated `source_capture.csv` and `claim_extraction.csv` records.

### Gate 2: Resolution and Evidence Reconciliation
- **Preserved Responsibilities:** Responsibility 4 (Entity & Taxonomy) & Responsibility 5 (Evidence & Contradiction).
- **Inputs:** Extracted atomic claims, institution registries, sector taxonomy, duplicate detection engine.
- **Checks:** Match institutions, sectors, and geographies to canonical codes; establish relationship-bound source roles (`primary`, `corroborating`, `contradictory`); log competing figures in `contradiction_log.csv`.
- **Responsible Actors:** Entity Resolution Agent, Verification Agent, Reconciliation Agent.
- **Exit Evidence:** Populated `claim_source_relationship.csv` and resolved entity foreign keys.

### Gate 3: Automated Data Readiness
- **Preserved Responsibilities:** Responsibility 6 (Schema Validation) & Responsibility 9 (Database Readiness).
- **Inputs:** Structured CSV interchange templates and relational batch package.
- **Checks:** Execute AJV Draft-07 validation and exact enum equality against `canonical-vocabulary.v1.1.2.json`; verify numeric decimals, ISO currencies, non-production markers, structured dates, configured foreign-key integrity, identifier uniqueness, and deterministic dry-run behavior.
- **Responsible Actor:** Schema / QA Agent.
- **Exit Evidence:** Automated validation report with zero errors and validated batch plan hash.

### Gate 4: Editorial Governance & Human Sign-Off
- **Preserved Responsibilities:** Responsibility 7 (Editorial Review) & Responsibility 8 (Human Approval).
- **Inputs:** Fully validated record package, claim evidence bundle, contradiction logs.
- **Checks:** Audit compliance against the 13 Truth Rules; verify tone is objective, positive, and non-hyperbolic; enforce mandatory human approval for critical claims, major financial values (>₦100B), and security topics.
- **Responsible Actors:** Editorial Agent & Human Lead Reviewer (Distinct Actors Required).
- **Exit Evidence:** Immutable sign-off entry in `review_decisions` table.

### Gate 5: Publication Projection & Stewardship
- **Preserved Responsibility:** Responsibility 10 (Post-Publication Review).
- **Inputs:** Approved database records, public connector operations, freshness schedule.
- **Checks:** Verify that public queries return only public fields (internal audit notes redacted); schedule freshness review velocity (30, 90, 180, 365 days); manage correction logs and version history.
- **Responsible Actors:** Data Publisher & Compliance Officer.
- **Exit Evidence:** Published live record projection and scheduled freshness review date.
