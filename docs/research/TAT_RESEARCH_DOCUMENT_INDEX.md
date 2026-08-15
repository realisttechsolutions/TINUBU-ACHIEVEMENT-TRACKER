# Tinubu Achievement Tracker — Research Document Index & Deprecation Registry (v1.1.1)

**Index Version:** 1.1.1  
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1.1  

This index provides the definitive, authoritative classification of every research document in `docs/research/`. All researchers, engineers, and automated agents must adhere to the classification status established herein.

---

## 1. Classification Definitions

- **CANONICAL (17 Files):** Authoritative, active, normative project documents for Contract v1.1.1. Must be consulted and obeyed.
- **SUPPORTING (18 Files):** Active operational guidelines, checklists, workflows, and blueprints supporting canonical standards.
- **SUPERSEDED (4 Files):** Historical pre-consolidation documents formally replaced by Contract v1.1.1 documents.
- **DEPRECATED (4 Files):** Obsolete documents containing retired technology assumptions (e.g. Supabase DDL). Retained with visible banners for git history integrity.

---

## 2. Master Document Registry (42 Research Documents)

### 2.1 Canonical Documents (17 Files)
| # | Document Path | Title / Subject | Classification | Replacement / Successor Document | Purpose & Authority |
|---:|---|---|:---:|---|---|
| 1 | `docs/research/TAT_RESEARCH_CONTRACT_V1_1_1.md` | Master Research Contract v1.1.1 | **CANONICAL** | None (Master Document) | Authoritative human-readable contract for Research Mission 01.1A onward. |
| 2 | `docs/research/TAT_RESEARCH_CONTRACT_V1_1.md` | Research Contract v1.1 (Historical Consolidation) | **CANONICAL** | `TAT_RESEARCH_CONTRACT_V1_1_1.md` | Initial consolidation contract post-Codex Audit 01. |
| 3 | `docs/research/TAT_CODEX_AUDIT_RESOLUTION_LOG.md` | Codex Audit Resolution Log | **CANONICAL** | None (Audit Deliverable) | Formal audit resolution log resolving all findings G-01 to G-28 and B-01/B-02. |
| 4 | `docs/research/TAT_RESEARCH_DOCUMENT_INDEX.md` | Research Document Index | **CANONICAL** | None (Governance Index) | Comprehensive 42-document classification and deprecation registry. |
| 5 | `docs/research/TAT_FRONTEND_CONTRACT_ALIGNMENT_REQUIREMENTS.md` | Frontend Alignment Requirements | **CANONICAL** | None (Architecture Specification) | Detailed adapter specifications for mapping database types to UI models in E01. |
| 6 | `docs/research/TAT_RESEARCH_CONTRACT_CHANGELOG.md` | Contract Changelog (v1.0 -> v1.1.1) | **CANONICAL** | None (Version Changelog) | Exhaustive changelog of all architectural, vocabulary, and schema updates. |
| 7 | `docs/research/TAT_SECTOR_TAXONOMY.md` | Hierarchical Sector Taxonomy | **CANONICAL** | None (Active Standard) | Defines 3-level taxonomy: 5 Public Groups -> 15 Canonical Sectors -> Subsectors. |
| 8 | `docs/research/TAT_STATUS_AND_CLASSIFICATION_STANDARD.md` | Status & Classification Standard | **CANONICAL** | None (Active Standard) | Defines 21-stage implementation status and 4 separated classification dimensions. |
| 9 | `docs/research/TAT_SOURCE_HIERARCHY.md` | Six-Tier Source Hierarchy | **CANONICAL** | None (Active Standard) | Authoritative 6-level source hierarchy with Level 6 as internal-only discovery. |
| 10 | `docs/research/TAT_SOURCE_ROLE_STANDARD.md` | Source Role Standard | **CANONICAL** | None (Active Standard) | Defines 11 relationship-bound source roles for Claim ↔ Source links. |
| 11 | `docs/research/TAT_EVIDENCE_STANDARD.md` | Atomic Evidence Standard | **CANONICAL** | None (Active Standard) | Atomic claim extraction and multi-source corroboration standards. |
| 12 | `docs/research/TAT_EVIDENCE_PROFILE_STANDARD.md` | Evidence Profile Standard | **CANONICAL** | None (Active Standard) | Defines 8 canonical evidence profile derivation rules. |
| 13 | `docs/research/TAT_QUALITY_CONTROL_GATES.md` | Quality Control Gates | **CANONICAL** | None (Active Standard) | 6 macro quality gates preserving all 10 explicit testable responsibilities. |
| 14 | `docs/research/TAT_RESEARCH_AGENT_OPERATING_MODEL.md` | Human & AI Operating Model | **CANONICAL** | None (Active Standard) | 11 research roles, separation of duties, and governed escalation policy. |
| 15 | `docs/research/TAT_RESEARCH_ROADMAP.md` | Eight-Stage Research Roadmap | **CANONICAL** | None (Active Standard) | 8-phase research expansion roadmap for May 2023 - Aug 2026. |
| 16 | `docs/research/TAT_RESEARCH_RISK_REGISTER.md` | Research & Operational Risk Register | **CANONICAL** | None (Active Standard) | Comprehensive 28-risk register with owners, triggers, mitigations, and contingencies. |
| 17 | `docs/research/TAT_MISSION_R01_COMPLIANCE_MATRIX.md` | Mission R01 Compliance Matrix | **CANONICAL** | None (Compliance Record) | Validated compliance evidence for all 60 criteria and Codex re-audit remediations. |

### 2.2 Active Supporting Documents (18 Files)
| # | Document Path | Title / Subject | Classification | Scope & Focus |
|---:|---|---|:---:|---|
| 18 | `docs/research/TAT_RESEARCH_WORKFLOW.md` | Research Workflow Standard | **SUPPORTING** | End-to-end research lifecycle from discovery through verification. |
| 19 | `docs/research/TAT_VERIFICATION_WORKFLOW.md` | Verification Workflow Standard | **SUPPORTING** | Detailed verification protocols and evidentiary proof thresholds. |
| 20 | `docs/research/TAT_CONTRADICTION_PROTOCOL.md` | Contradiction Protocol | **SUPPORTING** | Procedures for logging, preserving, and resolving competing figures. |
| 21 | `docs/research/TAT_DUPLICATE_DETECTION_STANDARD.md` | Duplicate Detection Standard | **SUPPORTING** | Rules for deduplication, algorithm scoring, and alias tracking. |
| 22 | `docs/research/TAT_DATA_FRESHNESS_POLICY.md` | Data Freshness Policy | **SUPPORTING** | Velocity-based review schedules (30, 90, 180, 365 days). |
| 23 | `docs/research/TAT_DATA_VERSIONING_AND_CORRECTION_STANDARD.md` | Data Versioning Standard | **SUPPORTING** | Correction procedures, immutable versions, and change logs. |
| 24 | `docs/research/TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md` | Internal / Public Data Boundary | **SUPPORTING** | Implementation-neutral access control and projection requirements. |
| 25 | `docs/research/TAT_RESEARCH_OUTPUT_TEMPLATES.md` | Research Output Templates Index | **SUPPORTING** | Registry of all 19 CSV research interchange templates. |
| 26 | `docs/research/TAT_IMPORT_EXPORT_STANDARD.md` | Import & Export Standard | **SUPPORTING** | Pipeline stages (`validate`, `dry-run`, `stage`, `commit`, `rollback`) and 9-step order. |
| 27 | `docs/research/TAT_RESEARCH_GOVERNANCE.md` | Research Governance Framework | **SUPPORTING** | Institutional oversight, RACI matrix, and stakeholder boards. |
| 28 | `docs/research/TAT_PILOT_RESEARCH_DESIGN.md` | Pilot Research Protocol | **SUPPORTING** | Protocol for 5-record representative pilot dataset in Phase 2. |
| 29 | `docs/research/TAT_COMPLETE_DATA_UNIVERSE.md` | Complete Data Universe | **SUPPORTING** | Conceptual entity inventory mapping to the 27-table logical model. |
| 30 | `docs/research/TAT_RECORD_TAXONOMY.md` | Record Taxonomy Standard | **SUPPORTING** | Detailed taxonomy documentation for 20 canonical record kinds. |
| 31 | `docs/research/MISSION_R01_RESEARCH_DATA_BLUEPRINT.md` | Mission R01 Blueprint | **SUPPORTING** | Foundational inventory of Research Mission 01 deliverables. |
| 32 | `docs/research/TAT_RESEARCH_OBJECTIVES.md` | Research Objectives Standard | **SUPPORTING** | Strategic objectives for administration achievements tracking. |
| 33 | `docs/research/TAT_RESEARCH_PRIORITISATION_STANDARD.md` | Research Prioritisation Standard | **SUPPORTING** | Positive selection rules paired with uncompromising truth standards. |
| 34 | `docs/research/TAT_RESEARCH_RISK_CLASSIFICATION.md` | Research Risk Classification | **SUPPORTING** | Claim-level risk rating criteria (Low, Medium, High, Critical). |
| 35 | `docs/research/TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md` | Research-to-Dev Handoff Guidance | **SUPPORTING** | Architectural guidance on contract alignment and adapter models. |

### 2.3 Superseded Documents (4 Files)
| # | Document Path | Title / Subject | Classification | Replacement Document |
|---:|---|---|:---:|---|
| 36 | `docs/research/CANONICAL_TAXONOMIES.md` | Legacy Combined Taxonomies | **SUPERSEDED** | `TAT_RESEARCH_CONTRACT_V1_1_1.md` & `canonical-vocabulary.v1.1.1.json` |
| 37 | `docs/research/DATA_INGESTION_CONTRACT.md` | Legacy Ingestion Contract | **SUPERSEDED** | `TAT_IMPORT_EXPORT_STANDARD.md` & `docs/engineering/CODEX_M01_DATA_INGESTION_REVIEW.md` |
| 38 | `docs/research/EVIDENCE_GOVERNANCE_AND_VERIFICATION.md` | Legacy Evidence Governance | **SUPERSEDED** | `TAT_EVIDENCE_STANDARD.md` & `TAT_SOURCE_ROLE_STANDARD.md` |
| 39 | `docs/research/RESEARCH_TEMPLATES_GUIDE.md` | Legacy 17-Template Guide | **SUPERSEDED** | `TAT_RESEARCH_OUTPUT_TEMPLATES.md` |

### 2.4 Deprecated Documents (4 Files)
| # | Document Path | Title / Subject | Classification | Replacement Document |
|---:|---|---|:---:|---|
| 40 | `docs/research/RESEARCH_TO_DEV_HANDOFF.md` | Legacy Supabase DDL / RLS Spec | **DEPRECATED** | `docs/engineering/CODEX_M01_FIREBASE_SQL_CONNECT_DATABASE_REVIEW.md` |
| 41 | `docs/research/SUPABASE_DATA_CONTRACT_AND_ENTITY_MAP.md` | Legacy Supabase 35-Table Map | **DEPRECATED** | `docs/engineering/CODEX_M01_FIREBASE_SQL_CONNECT_DATABASE_REVIEW.md` |
| 42 | `docs/research/TAT_SUPABASE_DATA_CONTRACT_V1.md` | Legacy Supabase Data Contract v1 | **DEPRECATED** | `TAT_RESEARCH_CONTRACT_V1_1_1.md` |
