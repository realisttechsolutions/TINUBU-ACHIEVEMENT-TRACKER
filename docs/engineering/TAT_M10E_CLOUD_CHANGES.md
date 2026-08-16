# TINUBU ACHIEVEMENT TRACKER V2
## Cloud Configuration & Staging Changes Register (Mission 10E)

---

## 1. Scope & Authorization Principle

Under Section 35 of Development Mission 10E, changes are authorized strictly on Google Cloud / Firebase staging project `tinubu-achievement-stg`. Production project `tinubu-achievement-tracker` is completely untouched.

---

## 2. Inventory of Authorized Staging Cloud Configuration

| Resource / Component | Scope | Configured State / Requirement | Security Rationale |
| :--- | :--- | :--- | :--- |
| **Identity Toolkit API** | `tinubu-achievement-stg` | `identitytoolkit.googleapis.com` enabled | Required for Firebase Authentication and Admin SDK token validation. |
| **Auth Provider** | `tinubu-achievement-stg` | **Email/Password** provider enabled. Public registration disabled. | Strictly gates account creation to out-of-band operator bootstrap CLI scripts. |
| **Password Policy** | `tinubu-achievement-stg` | Enforce 12+ chars, uppercase, lowercase, numeric, non-alphanumeric. | Prevents brute-force or dictionary compromises of staff credentials. |
| **Email Enumeration Protection** | `tinubu-achievement-stg` | Enabled (`client.permissions.disabledUserSignup: true`, generic auth responses). | Prevents external probing of staff email addresses. |
| **App Hosting Staging Backend** | `tat-staging` | Deployed from branch `antigravity/mission-10e-admin-auth`. | Live staging verification of `/admin/*` routes and session cookies. |
| **Cloud SQL Connection Boundary** | `tat-staging-db-app@...` | **STRICTLY READ-ONLY** (`SELECT` on canonical schema). | Zero schema mutations or table write privileges granted. |

---

## 3. Database Privilege Boundary Certification

- **Public Identity:** `tat-staging-db-app@tinubu-achievement-stg.iam`
- **Permissions:** `CONNECT`, `USAGE on SCHEMA public`, `SELECT` on all 27 canonical tables and views.
- **Explicit Invariant:** M10E did NOT grant `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `ALTER`, or `CREATE` to the runtime database role.
- **Database Schema:** 27 canonical tables, frozen Research Mission 02 dataset (`v1.1.2`), zero schema alterations.
