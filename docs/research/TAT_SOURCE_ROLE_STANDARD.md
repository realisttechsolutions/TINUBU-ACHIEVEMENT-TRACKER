# Tinubu Achievement Tracker — Source Role Architecture Standard (v1.1)

**Standard Version:** 1.1.2
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1.2
**Template Binding:** `research/templates/claim_source_relationship.csv`  
**Schema Binding:** `research/schemas/claim_source_relationship.schema.json`  

---

## 1. Core Architectural Principle: Relationship-Bound Roles

> [!IMPORTANT]
> **SOURCE ROLES BELONG TO THE CLAIM ↔ SOURCE RELATIONSHIP, NOT TO THE SOURCE DOCUMENT ITSELF.**  
> A single source document (e.g. an NBS quarterly report) may serve as the **Primary Source** for an unemployment metric claim, a **Supporting Source** for a manufacturing policy claim, and a **Contradictory Source** against an unverified ministerial announcement.

---

## 2. The 11 Canonical Source Roles

| # | Source Role Code | Public Role Label | Relationship Definition | Evidentiary Purpose |
|---:|---|---|---|---|
| 1 | `primary` | Primary Source | The core authoritative document establishing the statutory, legal, or physical claim. | Foundation proof of enactment, contract award, or official appropriation. |
| 2 | `official_statistical` | Official Statistical Data | Official bulletin (NBS, CBN, DMO) providing empirical quantitative baseline or outcome. | Authoritative statistical quantification of outcomes. |
| 3 | `direct_implementation` | Direct Implementation Record | Engineering logs, contractor delivery certificates, or operational telemetry. | Empirical proof of physical construction or operational status. |
| 4 | `independent_assessment` | Independent Assessment | External institutional evaluation by multilateral bodies, professional audits, or academia. | Independent validation of delivery quality and societal outcome. |
| 5 | `corroborating` | Corroborating Source | Secondary independent source confirming the facts, dates, or progress of the claim. | Multi-source confirmation reducing reliance on single citations. |
| 6 | `supporting` | Supporting Source | Supplementary background, baseline context, or historical comparison. | Explanatory context and sector baseline setting. |
| 7 | `contextual` | Contextual Source | Broader economic, sector, or policy environment documentation. | Macroeconomic or legislative background. |
| 8 | `contradictory` | Contradictory Source | Competing, divergent, or disputed evidence logged for research integrity. | Transparent preservation of conflicting numbers or dates. |
| 9 | `replacement` | Replacement Source | Supersedes a broken, outdated, or retracted source link. | Audit trail preserving source provenance across revisions. |
| 10 | `archived` | Archived Snapshot | Permanent web archive snapshot (Wayback Machine, Perma.cc) preserving ephemeral sources. | Protection against government portal link rot and source deletion. |
| 11 | `discovery_lead` | Discovery Lead | Initial trigger that alerted researchers to investigate the achievement. | Internal provenance tracking (strictly non-public proof). |

---

## 3. Claim-Source Relationship Schema Architecture

The join entity `claim_source_relationships` binds an atomic factual claim to an evidence source:

```text
+───────────────────────────────────────────────────────────+
|                  evidence_claims                          |
|  - claim_id (PK)                                          |
|  - record_id (FK -> records.id)                           |
|  - claim_text, claim_type, value_nature, reporting_origin |
+───────────────────────────────────────────────────────────+
                             │ 1
                             │
                             │ N
+───────────────────────────────────────────────────────────+
|             claim_source_relationships                    |
|  - relationship_id (PK)                                   |
|  - claim_id (FK -> evidence_claims.id)                    |
|  - source_id (FK -> sources.id)                           |
|  - source_role (11 canonical roles)                       |
|  - relationship_type (supports / contradicts / replaces)  |
|  - evidence_location (Page 4, Table 2, Paragraph 3)       |
|  - evidence_summary (Short researcher summary)            |
|  - review_status (source_confirmed, cross_referenced)     |
+───────────────────────────────────────────────────────────+
                             │ N
                             │
                             │ 1
+───────────────────────────────────────────────────────────+
|                       sources                             |
|  - source_id (PK)                                         |
|  - title, institution, source_level, url, archive_url     |
+───────────────────────────────────────────────────────────+
```
