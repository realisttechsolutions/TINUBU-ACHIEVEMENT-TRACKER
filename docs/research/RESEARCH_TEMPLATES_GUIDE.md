# Research Templates & Ingestion Guide — Tinubu Achievement Tracker V2

> [!WARNING]
> **STATUS: SUPERSEDED BY CANONICAL TEMPLATES REGISTRY**  
> This legacy document referenced 17 templates at obsolete `templates/research/` paths. It has been superseded by [`TAT_RESEARCH_OUTPUT_TEMPLATES.md`](./TAT_RESEARCH_OUTPUT_TEMPLATES.md), which indexes all 19 canonical templates under `research/templates/`.

This document provides the historical pre-consolidation template guide.

---

## 📋 Overview of 17 Standardized Research Output Templates

| Template Code | Template Name | File Location (`templates/research/`) | Purpose | Primary / Secondary |
| :--- | :--- | :--- | :--- | :--- |
| **A** | Source Capture Template | `sources_research_template.csv` | Bibliographic capture of gazettes, bulletins, and reports | Primary Evidence |
| **B** | Entity Discovery Template | `entity_discovery_template.csv` | Initial candidate lead capture prior to claim extraction | Discovery |
| **C** | Claim Extraction Template | `claim_extraction_template.csv` | Atomic extraction of factual claims from source text | Evidence Breakdown |
| **D** | Achievement Record Template | `achievements_research_template.csv` | Primary achievement record research ingestion | Primary Content |
| **E** | Policy Record Template | `policies_research_template.csv` | Executive orders, acts, and policy reform ingestion | Primary Content |
| **F** | Project Record Template | `projects_research_template.csv` | Physical capital infrastructure project ingestion | Primary Content |
| **G** | Programme Record Template | `programmes_research_template.csv` | Non-physical social intervention & credit scheme ingestion | Primary Content |
| **H** | Indicator & Observation Template | `indicators_research_template.csv` | Macroeconomic & sector indicator time-series ingestion | Primary Metric |
| **I** | Timeline Event Template | `timeline_events_research_template.csv` | Dated implementation milestone ingestion | Chronology |
| **J** | Financial Record Template | `financial_records_research_template.csv` | Approval vs. funding release vs. expenditure ingestion | Financial Audit |
| **K** | Beneficiary Record Template | `beneficiary_records_research_template.csv` | Registered applicant vs. active recipient ingestion | Beneficiary Audit |
| **L** | Contradiction Log Template | `contradiction_log_template.csv` | Preserves competing numbers/dates across sources | Audit & Governance |
| **M** | Duplicate Review Template | `duplicate_review_template.csv` | Merging candidate duplicates and preserving aliases | Data Quality |
| **N** | Data Gap Template | `data_gap_template.csv` | Tracking missing information & research priorities | Research Planning |
| **O** | Correction Template | `correction_template.csv` | Historical revision and figure update audit log | Versioning |
| **P** | Freshness Review Template | `freshness_review_template.csv` | Velocity-based review dates & stale thresholds | Maintenance |
| **Q** | Publication Review Template | `publication_review_template.csv` | Senior editor sign-off & 12 Truth Rules check | Editorial Sign-Off |

---

## 🛠️ Usage Rules for Human & AI Researchers

1. **UTF-8 Encoding**: All CSV uploads MUST be UTF-8 encoded.
2. **Snake Case Column Names**: Row 1 MUST match the exact column names specified in each template file.
3. **Non-Production Placeholders**: All example rows in templates are explicitly marked `[EXAMPLE ONLY - NOT A PRODUCTION RECORD]`.
4. **Pipe Separators (`|`)**: Multi-value fields (such as `states_covered`, `responsible_institutions`, `aliases`) MUST use the pipe symbol `|` without extra spaces.
5. **Stage & Classification Integrity**: Ingestion scripts validate that `financial_records` and `beneficiary_records` explicitly separate contract approval from disbursed expenditure, and applicants from active recipients.
