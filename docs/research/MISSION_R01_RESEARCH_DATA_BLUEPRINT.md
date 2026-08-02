# Research Mission 01 — Master Research and Data Foundation Blueprint

## 1. Executive Summary & Programme Purpose
This document constitutes the master architecture blueprint for the **Tinubu Achievement Tracker (TAT) V2 Research and Evidence Programme**.

The primary purpose of the platform is to systematically identify, organize, verify, document, and communicate positive policies, reforms, programmes, projects, implementation milestones, and measurable public outcomes associated with the administration of President Bola Ahmed Tinubu.

---

## 2. Shared Data Contract Between Research and Engineering
To prevent disconnects between research data collection and technical implementation, this blueprint establishes a unified data contract between:
- Human & AI Researchers
- Editorial & Fact-Checking Auditors
- Supabase Relational Database Schema
- Frontend React Components (`src/pages/*`, `src/components/*`)
- Public Data Downloads & Search Indexing

---

## 3. Structural Index of Mission 01 Documentation Suite

The complete Research Mission 01 specification is structured into the following 30 canonical documents located in `docs/research/`:

| Document Path | Title & Core Subject |
| :--- | :--- |
| **[MISSION_R01_RESEARCH_DATA_BLUEPRINT.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/MISSION_R01_RESEARCH_DATA_BLUEPRINT.md)** | Master Research & Data Foundation Blueprint (Index & Architecture) |
| **[TAT_RESEARCH_OBJECTIVES.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_OBJECTIVES.md)** | 5-Tier Research Programme Objectives |
| **[TAT_COMPLETE_DATA_UNIVERSE.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_COMPLETE_DATA_UNIVERSE.md)** | Complete Entity Map across Core, Taxonomy, Geographic, and Financial Domains |
| **[TAT_RECORD_TAXONOMY.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RECORD_TAXONOMY.md)** | 20 Conceptual Record Types & Qualification Criteria |
| **[TAT_SECTOR_TAXONOMY.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_SECTOR_TAXONOMY.md)** | 5 Primary Sectors & 15 Subsector Coverage Matrix |
| **[TAT_STATUS_AND_CLASSIFICATION_STANDARD.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_STATUS_AND_CLASSIFICATION_STANDARD.md)** | 21 Implementation Statuses & 12 Data Classifications |
| **[TAT_SOURCE_HIERARCHY.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_SOURCE_HIERARCHY.md)** | 6-Tier Evidence Source Hierarchy (Levels 1 to 6) |
| **[TAT_SOURCE_ROLE_STANDARD.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_SOURCE_ROLE_STANDARD.md)** | 11 Claim-Level Relationship Source Roles |
| **[TAT_EVIDENCE_STANDARD.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_EVIDENCE_STANDARD.md)** | Atomic Claim Evidence Structure & 8 Verification Statuses |
| **[TAT_EVIDENCE_PROFILE_STANDARD.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_EVIDENCE_PROFILE_STANDARD.md)** | 8 Cumulative Record-Level Evidence Profiles |
| **[TAT_RESEARCH_WORKFLOW.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_WORKFLOW.md)** | 14-Stage Repeatable Research Lifecycle |
| **[TAT_VERIFICATION_WORKFLOW.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_VERIFICATION_WORKFLOW.md)** | Minimum Verification Standards by Record Type |
| **[TAT_CONTRADICTION_PROTOCOL.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_CONTRADICTION_PROTOCOL.md)** | Contradiction Logging & Severity Resolution Matrix |
| **[TAT_DUPLICATE_DETECTION_STANDARD.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_DUPLICATE_DETECTION_STANDARD.md)** | Duplicate Matching Signals & Merge Protocol |
| **[TAT_DATA_FRESHNESS_POLICY.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_DATA_FRESHNESS_POLICY.md)** | Velocity Classes, Stale Thresholds & Review Schedules |
| **[TAT_RESEARCH_AGENT_OPERATING_MODEL.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_AGENT_OPERATING_MODEL.md)** | 11-Role Multi-Agent Human & AI Operating Rules |
| **[TAT_RESEARCH_RISK_CLASSIFICATION.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_RISK_CLASSIFICATION.md)** | 4-Tier Risk Classification & Source Requirements |
| **[TAT_SUPABASE_DATA_CONTRACT_V1.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_SUPABASE_DATA_CONTRACT_V1.md)** | Proposed Supabase Data Contract & Field Standards |
| **[TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md)** | 35-Entity Database Relationship Map & Import Order |
| **[TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md)** | Public vs. Internal Audit Field Boundaries & RLS Rules |
| **[TAT_RESEARCH_OUTPUT_TEMPLATES.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_OUTPUT_TEMPLATES.md)** | Reference Specifications for 18 CSV & Schema Templates |
| **[TAT_IMPORT_EXPORT_STANDARD.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_IMPORT_EXPORT_STANDARD.md)** | Standard File Formats & Batch Import Pipelines |
| **[TAT_QUALITY_CONTROL_GATES.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_QUALITY_CONTROL_GATES.md)** | 5 Quality Gates & Editorial Approval Checkpoints |
| **[TAT_RESEARCH_PRIORITISATION_STANDARD.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_PRIORITISATION_STANDARD.md)** | Prioritisation Criteria for High-Impact Delivery |
| **[TAT_PILOT_RESEARCH_DESIGN.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_PILOT_RESEARCH_DESIGN.md)** | Controlled Infrastructure & Economic Reform Pilot |
| **[TAT_RESEARCH_ROADMAP.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_ROADMAP.md)** | 5-Phase Research Implementation Schedule |
| **[TAT_RESEARCH_GOVERNANCE.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_GOVERNANCE.md)** | Governance Oversight & Institutional Review |
| **[TAT_DATA_VERSIONING_AND_CORRECTION_STANDARD.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_DATA_VERSIONING_AND_CORRECTION_STANDARD.md)** | Correction Transparency & Historical Revision Log |
| **[TAT_RESEARCH_RISK_REGISTER.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_RISK_REGISTER.md)** | Risk Matrix & Mitigation Strategies |
| **[TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md](file:///c:/Users/DELL/Documents/111%20ANTI%20%26%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER/docs/research/TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md)** | Technical Architecture Proposal & Audit Checklist |
