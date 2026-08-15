# Data Ingestion Contract & Field Boundaries — Tinubu Achievement Tracker V2

> [!WARNING]
> **STATUS: SUPERSEDED BY RESEARCH CONTRACT V1.1 & CODEX INGESTION SPECIFICATION**  
> This legacy document has been formally superseded by [`TAT_IMPORT_EXPORT_STANDARD.md`](./TAT_IMPORT_EXPORT_STANDARD.md), [`TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md`](./TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md), and [`TAT_RESEARCH_CONTRACT_V1_1_2.md`](./TAT_RESEARCH_CONTRACT_V1_1_2.md). Implementation-specific ingestion mechanisms are engineering responsibilities.

This document establishes the historical pre-consolidation data boundary proposals.

---

## 1. Public vs. Internal Data Boundaries

To enforce data security, researcher accountability, and compliance, data fields are strictly segmented into **Public API Fields** (accessible on the website) and **Internal Audit Fields** (restricted to database admins and editorial review).

### 1.1 Field Separation Matrix

| Field Name | Data Type | Visibility Boundary | Purpose & Ingestion Rules |
| :--- | :--- | :--- | :--- |
| `id` | `UUID / String` | **Public** | Primary Key slug or UUID. Must be lowercase alphanumeric with hyphens. |
| `slug` | `String` | **Public** | Unique URL identifier. Must be unique across all records. |
| `title` | `String` | **Public** | Official descriptive title. Plain text, max 250 characters. |
| `short_title` | `String` | **Public** | Concise title for breadcrumbs and mobile cards. Max 60 chars. |
| `achievement_type` | `Enum` | **Public** | Restricted enum (`physical-project`, `policy-reform`, etc.). |
| `sector` | `Enum` | **Public** | Primary sector slug (`economy`, `security`, `infrastructure`, etc.). |
| `summary` | `String` | **Public** | 1-2 sentence executive summary. Plain text, max 400 chars. |
| `full_description` | `String` | **Public** | In-depth background narrative. Markdown supported. |
| `impact_outcome` | `String` | **Public** | Verified quantitative or qualitative result. Plain text. |
| `beneficiaries_or_scope` | `String` | **Public** | Human-readable geographic/demographic scope description. |
| `status` | `Enum` | **Public** | Controlled implementation status badge value. |
| `classification` | `Enum` | **Public** | `Actual`, `Provisional`, `Projected`, or `Target`. |
| `publication_status` | `Enum` | **Public / Audit** | Controls public API filtering (`publishable`, `publishable-with-qualification`). |
| `lead_ministry_or_agency` | `String` | **Public** | Primary responsible MDA name. |
| `geopolitical_zone` | `String` | **Public** | Zone name or composite string (e.g., "South-West"). |
| `states_covered` | `Array[String]`| **Public** | Array of state names or ISO codes. Split by `|` in CSV. |
| `start_date` | `Date / String` | **Public** | Implementation start date (`YYYY-MM-DD` or `YYYY-MM`). |
| `completion_or_current_date` | `Date / String` | **Public** | Completion date or current status date. |
| `verification_date` | `Date / String` | **Public** | Date of last verification audit (`YYYY-MM-DD`). |
| `featured_image` | `URL` | **Public** | Asset image URL. |
| `related_achievement_slugs` | `Array[String]`| **Public** | Array of cross-referenced achievement slugs (`|` separated). |
| `internal_notes` | `String` | **INTERNAL ONLY** | Researcher working notes, methodology queries, verification logs. |
| `researcher_id` | `String` | **INTERNAL ONLY** | Researcher email or staff ID responsible for drafting. |
| `verifier_id` | `String` | **INTERNAL ONLY** | Senior editor / auditor who approved record. |
| `evidence_raw_url` | `URL` | **INTERNAL ONLY** | Internal drive link to raw PDF gazette, scan, or unreleased document. |
| `rejection_reason` | `String` | **INTERNAL ONLY** | Explicit rationale if record is marked `rejected`. |
| `qualification_notes` | `String` | **INTERNAL ONLY** | Internal reasoning for `publishable-with-qualification` rating. |
| `confidence_score` | `Integer (1-5)`| **INTERNAL ONLY** | Internal statistical confidence rating. |

---

## 2. CSV File Ingestion Rules & Data Parsing

### 2.1 File Encoding & Formatting
- **File Format**: Standard UTF-8 encoded CSV.
- **Header Row**: Row 1 MUST contain exact field names in snake_case (matching CSV templates).
- **Text Enclosure**: Fields containing commas, quotes, or line breaks MUST be enclosed in double quotes (`"..."`).
- **Quotes Handling**: Double quotes inside text fields must be escaped with double double-quotes (`""`).

### 2.2 Delimiters & Nested Structure Handling
- **Scalar Fields**: Plain text or numeric values.
- **Array Fields (`states_covered`, `related_achievement_slugs`, `key_objectives`)**: Separated by pipe symbol `|` without spaces.
  - *Example*: `Lagos|Ogun|Ondo`
- **Complex JSON Fields (`key_metrics`, `milestones`, `sources`)**:
  - May be supplied as valid JSON strings enclosed in quotes within the CSV row.
  - Alternatively, sources and milestones can be ingested via dedicated relational CSV templates (`sources_research_template.csv`).

---

## 3. Ingestion & Validation Pipeline

```
[ Research CSV Upload ]
          │
          ▼
┌────────────────────────────────────────┐
│ Phase 1: Automated CSV Parser & Lint   │
│ - Validate CSV syntax & column headers │
│ - Check UTF-8 encoding                 │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│ Phase 2: Schema & Enum Validation      │
│ - Validate against JSON Schema         │
│ - Enforce enum values & date formats   │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│ Phase 3: Staging DB Ingestion          │
│ - Upsert into `staging_achievements`   │
│ - Run foreign key & slug uniqueness    │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│ Phase 4: Peer Review & Sign-Off        │
│ - Editor verifies Level 1-3 sources    │
│ - Set status = `publishable`           │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│ Phase 5: Production Supabase Sync      │
│ - Atomic move to `achievements` table  │
│ - Frontend API cache revalidated       │
└────────────────────────────────────────┘
```

---

## 4. Error Handling & Rejection Protocols

1. **Schema Mismatch**: If a row fails schema validation (e.g. invalid `sector` enum or malformed date), the ingestion pipeline rejects that specific row, writes an entry to `ingestion_error_log.json`, and notifies the researcher.
2. **Missing Level 1-3 Source**: Records submitted as `publishable` without at least one Level 1-3 source URL/citation will automatically revert to `under-review`.
3. **Duplicate Slugs**: Slug uniqueness is strictly enforced. Duplicate slugs trigger an immediate pipeline pause.

---

## 5. Editorial Mandate Guardrails & Verification Checks

In accordance with the platform's **Editorial Mandate & Public Disclosure Standard**, the ingestion pipeline enforces automated and manual review checks for the 12 Truth Rules:

1. **Stage Consistency Check**: Ingestion scripts reject any record marking an announcement or speech as `Completed` or `Operational`.
2. **Financial Distinction Check**: Ingestion validation prevents marking FEC contract approvals as "Disbursed Expenditure".
3. **Classification Integrity Check**: Records classified as `Target` or `Projected` CANNOT use status `Completed` or `Outcome Recorded`.
4. **Beneficiary Data Audit**: Beneficiary metrics must explicitly distinguish registered applicants from verified disbursement recipients.
5. **Single-Source Circularity Rule**: Automated linter flags duplicate citations that originate from a single press statement reproduced across multiple news outlets.
6. **Public Transparency Mandatory Field**: Every public page must render the canonical achievements-focused disclosure header/footer text.
