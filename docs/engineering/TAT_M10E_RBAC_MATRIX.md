# TINUBU ACHIEVEMENT TRACKER V2
## Staff Role-Based Access Control (RBAC) Matrix (Mission 10E)

---

## 1. Canonical Staff Roles & Authority Definitions

Mission 10E defines four non-overlapping staff roles with strict separation of concerns:

| Role Name | Identifier (`tat_role`) | Purpose & Operational Authority | Scoped Routes |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `super_admin` | Full governance, user provisioning, role assignments, security audits, and universal access across all modules. | `/admin`, `/admin/research`, `/admin/review`, `/admin/publish`, `/admin/users` |
| **Researcher** | `researcher` | Primary source intake, factual claim formulation, bibliographic citation linkage, quantitative data entry. | `/admin`, `/admin/research` |
| **Reviewer** | `reviewer` | Peer validation, citation cross-checking, confidence rating assignment, editorial decision queues. | `/admin`, `/admin/review` |
| **Publisher** | `publisher` | Staged-to-canonical release stamping, materialized cache refresh, public errata/correction publishing. | `/admin`, `/admin/publish` |

---

## 2. Complete Route Authorization Matrix

| Route / Endpoint | Anonymous Visitor | `researcher` | `reviewer` | `publisher` | `super_admin` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Public Routes (`/`, `/achievements`, `/policies`, etc.)** | **200 Allowed** | 200 Allowed | 200 Allowed | 200 Allowed | 200 Allowed |
| **`/api/health`** | **200 Allowed** | 200 Allowed | 200 Allowed | 200 Allowed | 200 Allowed |
| **`/admin/login`** | **200 Allowed** | Redirect `/admin` | Redirect `/admin` | Redirect `/admin` | Redirect `/admin` |
| **`/admin/forgot-password`** | **200 Allowed** | Redirect `/admin` | Redirect `/admin` | Redirect `/admin` | Redirect `/admin` |
| **`/admin/unauthorized`** | **200 Allowed** | 200 Allowed | 200 Allowed | 200 Allowed | 200 Allowed |
| **`/admin` (Dashboard Shell)** | Redirect `/admin/login` | **200 Authorized** | **200 Authorized** | **200 Authorized** | **200 Authorized** |
| **`/admin/research`** | Redirect `/admin/login` | **200 Authorized** | 403 Forbidden | 403 Forbidden | **200 Authorized** |
| **`/admin/review`** | Redirect `/admin/login` | 403 Forbidden | **200 Authorized** | 403 Forbidden | **200 Authorized** |
| **`/admin/publish`** | Redirect `/admin/login` | 403 Forbidden | 403 Forbidden | **200 Authorized** | **200 Authorized** |
| **`/admin/users`** | Redirect `/admin/login` | 403 Forbidden | 403 Forbidden | 403 Forbidden | **200 Authorized** |
| **`POST /api/admin/auth/session`** | **200 Allowed (with valid token + CSRF)** | 200 Allowed | 200 Allowed | 200 Allowed | 200 Allowed |
| **`POST /api/admin/auth/logout`** | 403 / No-op | **200 Authorized** | **200 Authorized** | **200 Authorized** | **200 Authorized** |
| **`GET /api/admin/auth/me`** | 401 Unauthorized | **200 Authorized** | **200 Authorized** | **200 Authorized** | **200 Authorized** |

---

## 3. Database Schema Mapping & Future Identity Reconciliation

### Existing PostgreSQL Schema (`database/schema.sql`)
The PostgreSQL schema provides the following tables for governance and audit trails:
1. `actor_profiles` (`id UUID PRIMARY KEY`, `full_name VARCHAR`, `email VARCHAR UNIQUE`, `role VARCHAR`, `is_active BOOLEAN`, `created_at TIMESTAMPTZ`).
2. `actor_roles` (`id UUID`, `actor_profile_id UUID`, `role_name VARCHAR`, `assigned_at TIMESTAMPTZ`, `assigned_by UUID`).
3. `editorial_audit_logs` (`id UUID`, `entity_type VARCHAR`, `entity_id UUID`, `actor_id UUID`, `action VARCHAR`, `diff JSONB`, `created_at TIMESTAMPTZ`).

### Identity Reconciliation Strategy (Mission 10F Pre-Alignment)
- Firebase Auth `UID` serves as the authoritative authentication subject.
- In Mission 10F, when writer capabilities are introduced, staff records in `actor_profiles` will map `actor_profiles.id` or a dedicated `external_auth_uid` field to Firebase `UID`.
- In Mission 10E, canonical schema integrity is 100% preserved with zero database schema migrations or data mutations.
