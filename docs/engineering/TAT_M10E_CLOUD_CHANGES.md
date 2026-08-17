# TINUBU ACHIEVEMENT TRACKER V2
## Cloud Configuration & Staging Changes Register (Mission 10E / 10E-FINAL-GATE / 10E-LIVE)

---

## 1. Scope & Authorization Principle

Under Section 35 of Development Mission 10E and Mission 10E-FINAL-GATE, changes are authorized strictly on Google Cloud / Firebase staging project `tinubu-achievement-stg`. Production project `tinubu-achievement-tracker` is completely untouched.

---

## 2. Inventory of Authorized Staging Cloud Configuration

| Resource / Component | Scope | Configured State / Requirement | Security Rationale |
| :--- | :--- | :--- | :--- |
| **Identity Toolkit API** | `tinubu-achievement-stg` | `identitytoolkit.googleapis.com` enabled | Required for Firebase Authentication and Admin SDK token validation. |
| **Auth Provider** | `tinubu-achievement-stg` | **Email/Password** provider enabled. Public registration disabled. | Strictly gates account creation to out-of-band operator bootstrap CLI scripts. |
| **Password Policy** | `tinubu-achievement-stg` | Enforce 12+ chars, uppercase, lowercase, numeric, non-alphanumeric. | Prevents brute-force or dictionary compromises of staff credentials. |
| **Email Enumeration Protection** | `tinubu-achievement-stg` | Enabled (`emailPrivacyConfig.enableImprovedEmailPrivacy: true`, generic auth responses). | Prevents external probing of staff email addresses. |
| **App Hosting Staging Backend** | `tat-staging` | Backend `tat-staging` (us-central1). | Live staging verification of `/admin/*` routes and session cookies. |
| **Cloud SQL Connection Boundary** | `tat-staging-db-app@...` / `tat_public_reader` | **SELECT ONLY THROUGH FOUR APPROVED PUBLIC VIEWS**. Direct base-table SELECT = **DENIED**. Writes = **DENIED**. | Zero base-table access or write privileges granted. |

---

## 3. Database Privilege Boundary Certification

- **Public Identity:** `tat-staging-db-app@tinubu-achievement-stg.iam` (member of `tat_public_reader`)
- **Authorized Projections:** `SELECT` ONLY on four approved public views:
  1. `public_record_catalog`
  2. `public_claim_evidence`
  3. `public_financial_records`
  4. `public_beneficiary_records`
- **Base Table Direct Access:** `SELECT` on all 27 canonical base tables is strictly **DENIED** (`zero_base_table_select = true`).
- **Mutation Privileges:** `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `ALTER`, `CREATE` are strictly **DENIED** (`zero_relation_writes = true`).
- **Schema Authority:** 27 canonical tables, frozen Research Mission 02 dataset (`v1.1.2`), zero schema alterations.
