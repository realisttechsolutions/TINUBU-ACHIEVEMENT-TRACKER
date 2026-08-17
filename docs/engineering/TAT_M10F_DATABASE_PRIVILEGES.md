# TAT Mission 10F-B: Database Privilege Matrix & Boundary Proof

## 1. Table Privilege Matrix (Verified Live on PostgreSQL Catalog)

| Table Name | `tat_public_reader` | `tat_admin_writer_m10f` | Purpose in M10F |
|---|---|---|---|
| `records` | **NONE** | `SELECT, INSERT, UPDATE` | Draft record creation and metadata overview updates |
| `achievement_profiles` | **NONE** | `SELECT, INSERT, UPDATE` | Achievement specific profiles |
| `policy_details` | **NONE** | `SELECT, INSERT, UPDATE` | Policy specific details |
| `project_details` | **NONE** | `SELECT, INSERT, UPDATE` | Project specific details |
| `programme_details` | **NONE** | `SELECT, INSERT, UPDATE` | Programme specific details |
| `record_sectors` | **NONE** | `SELECT, INSERT, UPDATE, DELETE` | Sector relationship associations |
| `record_institutions` | **NONE** | `SELECT, INSERT, UPDATE, DELETE` | Institution relationship associations |
| `record_geographies` | **NONE** | `SELECT, INSERT, UPDATE, DELETE` | Geography relationship associations |
| `sources` | **NONE** | `SELECT, INSERT, UPDATE, DELETE` | Citation and source documents |
| `evidence_claims` | **NONE** | `SELECT, INSERT, UPDATE, DELETE` | Evidence claim statements and metrics |
| `claim_source_relationships` | **NONE** | `SELECT, INSERT, UPDATE, DELETE` | Linkage between claims and sources |
| `financial_records` | **NONE** | `SELECT, INSERT, UPDATE` | Financial figures and appropriations |
| `beneficiary_records` | **NONE** | `SELECT, INSERT, UPDATE` | Beneficiary counts and cohorts |
| `timeline_events` | **NONE** | `SELECT, INSERT, UPDATE` | Key chronological milestones |
| `research_batches` | **NONE** | `SELECT, INSERT, UPDATE` | Research metadata batches |
| `sectors` | **NONE** | `SELECT` ONLY | Reference catalog (Read-only) |
| `institutions` | **NONE** | `SELECT` ONLY | Reference catalog (Read-only) |
| `geographic_units` | **NONE** | `SELECT` ONLY | Reference catalog (Read-only) |
| `actor_profiles` | **NONE** | `SELECT` ONLY | Master actor catalog (Read-only) |
| `review_decisions` | **NONE** | `SELECT` ONLY | Post-M10F review workflow (Protected) |
| `corrections` | **NONE** | `SELECT` ONLY | Post-M10F correction workflow (Protected) |
| `indicators` | **NONE** | `SELECT` ONLY | Master indicators (Read-only) |
| `indicator_observations` | **NONE** | `SELECT` ONLY | Observation series (Read-only) |

---

## 2. Public Views Granted to `tat_public_reader` (SELECT ONLY)

1. `public_record_catalog`
2. `public_claim_evidence`
3. `public_financial_records`
4. `public_beneficiary_records`

**Non-View Base Tables:** `0` granted to `tat_public_reader`.

---

## 3. Universal Prohibitions Enforced on `tat_admin_writer_m10f`

- **`TRUNCATE`:** `DENIED` across all tables.
- **`REFERENCES`:** `DENIED` across all tables.
- **`TRIGGER`:** `DENIED` across all tables.
- **`DDL` (`CREATE`, `ALTER`, `DROP`):** `DENIED` (`NOCREATEDB`, `NOCREATEROLE`).
- **`SUPERUSER`:** `DENIED` (`NOSUPERUSER`).
- **`REPLICATION` / `BYPASSRLS`:** `DENIED`.
