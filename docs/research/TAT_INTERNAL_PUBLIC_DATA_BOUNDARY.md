# Tinubu Achievement Tracker — Internal vs. Public Data Boundary Standard (v1.1.2)

**Standard Version:** 1.1.2
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1.2
**Target Engineering Specification:** Implementation-Neutral Architecture (Non-canonical Target: Firebase SQL Connect / PostgreSQL)  

---

## 1. Governance Purpose

This standard defines the boundary between **Public Data Projections** (openly accessible to the public on the web application) and **Internal Governance Data** (restricted to authenticated researchers, verifiers, and editorial administrators).

---

## 2. Field Visibility & Projection Boundaries

### 2.1 Public Presentation Fields
Public interface queries and datasets may expose only verified, publishable factual fields:
- Core Identifiers & Slugs: `id`, `slug`, `title`, `summary`, `description`
- Categorization: `public_navigation_group`, `sector`, `subsector`
- Lifecycle & Evidence: `status` (implementation status), `evidence_profile`, `date`, `date_precision`, `states_covered`, `geographic_scope`
- Separated Classifications: `data_value_nature`, `source_origin`, `verification_status`, `publication_status`
- Public Evidence Projections: Public source citations (Level 1–5 source titles, publishers, URLs, document numbers, page locators, evidence summaries)
- Quantitative Facts: Approved financial metrics, beneficiary counts, and indicator observation values

### 2.2 Internal Audit & Governance Fields (Strictly Restricted)
The following fields must **never** be exposed in public API or query responses:
- Researcher Identifiers: `researcher_id`, `assigned_reviewer`, `editor_id`, `revised_by`
- Discovery Leads & Level 6 Data: `discovery_source_url`, raw uncorroborated social tips
- Internal Deliberations: `reviewer_notes`, `resolution_rationale`, `rejection_reason`, `internal_notes`
- Quality Gate Audit Logs: Internal draft review manifests, intermediate batch plans
- Sensitive Geospatial Telemetry: Raw point coordinates for defense and national security infrastructure

---

## 3. Implementation-Neutral Access Control Requirements

The engineering backend must satisfy the following security invariants regardless of the chosen database technology:
1. **Public Read Isolation:** Unauthenticated public clients may read only records where `publication_status IN ('publishable', 'publishable_with_qualification', 'published')`.
2. **Draft Quarantine:** Records in `draft`, `under_review`, `rejected`, or `withdrawn` status must be strictly isolated from public query paths.
3. **Role-Based Authorization:** Write, update, and review operations require verified authenticated identity and appropriate role assignment (`researcher`, `verifier`, `editor`, `lead_editor`, `compliance_officer`, `admin`).
4. **Audit Immutability:** Post-publication adjustments must generate immutable audit records in the corrections and version history tables.

---

## 4. Evidence Storage Boundaries

- **Public Media Assets:** Publicly distributable charts, infographics, and authorized photos are served via public CDN.
- **Restricted Evidence Documents:** Internal PDF gazettes, raw government circulars, and archive snapshots are retained in access-controlled storage accessible only to authorized researchers.
