# Tinubu Achievement Tracker — Research Document Index & Deprecation Registry

**Index Version:** 1.1  
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1  

This index provides the definitive, authoritative classification of every research document in `docs/research/`. All researchers, engineers, and automated agents must adhere to the classification status established herein.

---

## 1. Classification Definitions

- **CANONICAL:** Authoritative, active, normative project document for Contract v1.1. Must be consulted and obeyed.
- **SUPPORTING:** Active operational guidelines, checklists, and blueprints supporting canonical standards.
- **LEGACY:** Historical pre-consolidation document retained for background context only; not authoritative.
- **DEPRECATED:** Obsolete document containing superseded assumptions (e.g. Supabase-specific DDL). Retained with visible banner for git history integrity.
- **SUPERSEDED:** Document whose core substance has been formally replaced by a newer Contract v1.1 document.

---

## 2. Master Document Registry

| # | Document Path | Title / Subject | Classification | Replacement / Successor Document | Rationale / Deprecation Notice |
|---:|---|---|:---:|---|---|
| 1 | `docs/research/TAT_RESEARCH_CONTRACT_V1_1.md` | Master Research Contract v1.1 | **CANONICAL** | None (Master Document) | Authoritative human-readable contract for Research Mission 01.1 onward. |
| 2 | `docs/research/TAT_CODEX_AUDIT_RESOLUTION_LOG.md` | Codex Audit Resolution Log | **CANONICAL** | None (Audit Deliverable) | Formal audit resolution log resolving all findings G-01 through G-28. |
| 3 | `docs/research/TAT_RESEARCH_DOCUMENT_INDEX.md` | Research Document Index | **CANONICAL** | None (Governance Index) | Comprehensive document classification and deprecation registry. |
| 4 | `docs/research/TAT_FRONTEND_CONTRACT_ALIGNMENT_REQUIREMENTS.md` | Frontend Alignment Requirements | **CANONICAL** | None (Architecture Specification) | Detailed adapter specifications for mapping SQL Connect types to UI models. |
| 5 | `docs/research/TAT_RESEARCH_CONTRACT_CHANGELOG.md` | Contract Changelog (v1.0 -> v1.1) | **CANONICAL** | None (Version Changelog) | Exhaustive changelog of all architectural and schema updates. |
| 6 | `docs/research/TAT_SECTOR_TAXONOMY.md` | Hierarchical Sector Taxonomy | **CANONICAL** | None (Active Standard) | Defines 3-level taxonomy: 5 Public Groups -> 15 Canonical Sectors -> Subsectors. |
| 7 | `docs/research/TAT_STATUS_AND_CLASSIFICATION_STANDARD.md` | Status & Classification Standard | **CANONICAL** | None (Active Standard) | Defines 21-stage implementation status and 4 separated classification dimensions. |
| 8 | `docs/research/TAT_SOURCE_HIERARCHY.md` | Six-Tier Source Hierarchy | **CANONICAL** | None (Active Standard) | Authoritative 6-level source hierarchy with Level 6 as internal-only discovery. |
| 9 | `docs/research/TAT_SOURCE_ROLE_STANDARD.md` | Source Role Standard | **CANONICAL** | None (Active Standard) | Defines 11 relationship-bound source roles for Claim ↔ Source links. |
| 10 | `docs/research/TAT_EVIDENCE_STANDARD.md` | Atomic Evidence Standard | **CANONICAL** | None (Active Standard) | Atomic claim extraction and multi-source corroboration standards. |
| 11 | `docs/research/TAT_EVIDENCE_PROFILE_STANDARD.md` | Evidence Profile Standard | **CANONICAL** | None (Active Standard) | Defines 8 canonical evidence profile derivation rules. |
| 12 | `docs/research/TAT_QUALITY_CONTROL_GATES.md` | Quality Control Gates | **CANONICAL** | None (Active Standard) | 6 macro quality gates preserving all 10 explicit testable responsibilities. |
| 13 | `docs/research/TAT_RESEARCH_AGENT_OPERATING_MODEL.md` | Human & AI Operating Model | **CANONICAL** | None (Active Standard) | 11 research roles and separation of duties preventing automated unreviewed publishing. |
| 14 | `docs/research/TAT_RESEARCH_ROADMAP.md` | Eight-Stage Research Roadmap | **CANONICAL** | None (Active Standard) | Restores full 8-phase research expansion roadmap for May 2023 - Aug 2026. |
| 15 | `docs/research/TAT_RESEARCH_RISK_REGISTER.md` | Research & Operational Risk Register | **CANONICAL** | None (Active Standard) | Comprehensive 28-risk register with owners, triggers, mitigations, and contingencies. |
| 16 | `docs/research/TAT_MISSION_R01_COMPLIANCE_MATRIX.md` | Mission R01 Compliance Matrix | **CANONICAL** | None (Compliance Record) | Validated compliance evidence for all 60 criteria and Codex gap remediations. |
| 17 | `docs/research/TAT_RESEARCH_WORKFLOW.md` | Research Workflow Standard | **SUPPORTING** | None (Active Workflow) | End-to-end research lifecycle from discovery through verification and publication. |
| 18 | `docs/research/TAT_VERIFICATION_WORKFLOW.md` | Verification Workflow Standard | **SUPPORTING** | None (Active Workflow) | Detailed verification protocols and evidentiary proof thresholds. |
| 19 | `docs/research/TAT_CONTRADICTION_PROTOCOL.md` | Contradiction Protocol | **SUPPORTING** | None (Active Protocol) | Procedures for logging, preserving, and resolving competing figures. |
| 20 | `docs/research/TAT_DUPLICATE_DETECTION_STANDARD.md` | Duplicate Detection Standard | **SUPPORTING** | None (Active Standard) | Rules for deduplication, algorithm scoring, and alias tracking. |
| 21 | `docs/research/TAT_DATA_FRESHNESS_POLICY.md` | Data Freshness Policy | **SUPPORTING** | None (Active Policy) | Velocity-based review schedules (30, 90, 180, 365 days). |
| 22 | `docs/research/TAT_DATA_VERSIONING_AND_CORRECTION_STANDARD.md` | Data Versioning Standard | **SUPPORTING** | None (Active Standard) | Correction procedures, immutable versions, and transparent change logs. |
| 23 | `docs/research/TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md` | Internal / Public Data Boundary | **SUPPORTING** | None (Active Security Standard) | Public connector field projection and restricted storage boundaries. |
| 24 | `docs/research/TAT_RESEARCH_OUTPUT_TEMPLATES.md` | Research Output Templates Index | **SUPPORTING** | None (Active Template Index) | Registry of all 19 CSV research interchange templates. |
| 25 | `docs/research/TAT_IMPORT_EXPORT_STANDARD.md` | Import & Export Standard | **SUPPORTING** | None (Active Pipeline Spec) | Pipeline stages (`validate`, `dry-run`, `stage`, `commit`, `rollback`) and batch rules. |
| 26 | `docs/research/TAT_RESEARCH_GOVERNANCE.md` | Research Governance Framework | **SUPPORTING** | None (Active Governance) | Institutional oversight, RACI matrix, and stakeholder review boards. |
| 27 | `docs/research/TAT_PILOT_RESEARCH_DESIGN.md` | Pilot Research Protocol | **SUPPORTING** | None (Active Pilot Spec) | Protocol for 5-record representative pilot dataset in Phase 2. |
| 28 | `docs/research/TAT_COMPLETE_DATA_UNIVERSE.md` | Complete Data Universe | **SUPPORTING** | `TAT_RESEARCH_CONTRACT_V1_1.md` | Conceptual entity inventory mapping to the 27-table logical model. |
| 29 | `docs/research/TAT_RECORD_TAXONOMY.md` | Record Taxonomy Standard | **SUPPORTING** | `TAT_RESEARCH_CONTRACT_V1_1.md` | Detailed taxonomy documentation for 20 canonical record kinds. |
| 30 | `docs/research/MISSION_R01_RESEARCH_DATA_BLUEPRINT.md` | Mission R01 Blueprint | **SUPPORTING** | `TAT_RESEARCH_CONTRACT_V1_1.md` | Foundational inventory of Research Mission 01 deliverables. |
| 31 | `docs/research/TAT_RESEARCH_OBJECTIVES.md` | Research Objectives Standard | **SUPPORTING** | `TAT_RESEARCH_CONTRACT_V1_1.md` | Strategic objectives for administration achievements tracking. |
| 32 | `docs/research/TAT_RESEARCH_PRIORITISATION_STANDARD.md` | Research Prioritisation Standard | **SUPPORTING** | `TAT_RESEARCH_CONTRACT_V1_1.md` | Positive selection rules paired with uncompromising truth standards. |
| 33 | `docs/research/TAT_RESEARCH_RISK_CLASSIFICATION.md` | Research Risk Classification | **SUPPORTING** | `TAT_RESEARCH_RISK_REGISTER.md` | Claim-level risk rating criteria (Low, Medium, High, Critical). |
| 34 | `docs/research/TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md` | Research-to-Dev Handoff Guidance | **SUPPORTING** | `TAT_FRONTEND_CONTRACT_ALIGNMENT_REQUIREMENTS.md` | Architectural guidance clarifying that research contracts do not write production code. |
| 35 | `docs/research/CANONICAL_TAXONOMIES.md` | Legacy Combined Taxonomies | **SUPERSEDED** | `TAT_RESEARCH_CONTRACT_V1_1.md` & `canonical-vocabulary.v1.1.json` | Replaced by Contract v1.1 canonical vocabulary and separated taxonomy standards. |
| 36 | `docs/research/DATA_INGESTION_CONTRACT.md` | Legacy Ingestion Contract | **SUPERSEDED** | `docs/engineering/CODEX_M01_DATA_INGESTION_REVIEW.md` & `TAT_IMPORT_EXPORT_STANDARD.md` | Replaced by SQL Connect Admin SDK ingestion contract and 9-step import order. |
| 37 | `docs/research/EVIDENCE_GOVERNANCE_AND_VERIFICATION.md` | Legacy Evidence Governance | **SUPERSEDED** | `TAT_EVIDENCE_STANDARD.md` & `TAT_SOURCE_ROLE_STANDARD.md` | Replaced by relationship-bound source roles and many-to-many claim architecture. |
| 38 | `docs/research/RESEARCH_TEMPLATES_GUIDE.md` | Legacy 17-Template Guide | **SUPERSEDED** | `TAT_RESEARCH_OUTPUT_TEMPLATES.md` | Pointed to obsolete `templates/research` paths; replaced by 19 canonical templates. |
| 39 | `docs/research/RESEARCH_TO_DEV_HANDOFF.md` | Legacy Supabase DDL / RLS Spec | **DEPRECATED** | `docs/engineering/CODEX_M01_FIREBASE_SQL_CONNECT_DATABASE_REVIEW.md` | Supabase RLS and manual DDL deprecated in favor of Firebase SQL Connect. |
| 40 | `docs/research/SUPABASE_DATA_CONTRACT_AND_ENTITY_MAP.md` | Legacy Supabase 35-Table Map | **DEPRECATED** | `docs/engineering/CODEX_M01_FIREBASE_SQL_CONNECT_DATABASE_REVIEW.md` | Unenforceable polymorphic FKs deprecated; superseded by 27-table logical model. |
| 41 | `docs/research/TAT_SUPABASE_DATA_CONTRACT_V1.md` | Legacy Supabase Data Contract v1 | **DEPRECATED** | `TAT_RESEARCH_CONTRACT_V1_1.md` | Four-bullet placeholder superseded by authoritative Contract v1.1. |
| 42 | `docs/research/TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md` | Legacy Supabase ER Map | **DEPRECATED** | `docs/engineering/CODEX_M01_FIREBASE_SQL_CONNECT_DATABASE_REVIEW.md` | Table list without constraints superseded by 27-table relational architecture. |
