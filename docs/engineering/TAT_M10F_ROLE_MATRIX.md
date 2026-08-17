# TAT Mission 10F-B: Staff Role Authorization Matrix

| Staff Role | Session Verified | M10F UI Access | M10F Read Records | M10F Create / Edit Drafts | Final Publish Approval |
|---|---|---|---|---|---|
| `super_admin` | Required | Full (`/admin/*`) | **YES** | **YES** | Reserved (Future Mission) |
| `researcher` | Required | Editorial (`/admin/records/*`) | **YES** | **YES** | **NO** |
| `reviewer` | Required | Review Portal (`/admin/review`) | **YES** | **NO (HTTP 403)** | **NO** |
| `publisher` | Required | Publish Portal (`/admin/publish`) | **YES** | **NO (HTTP 403)** | Reserved (Future Mission) |
| `Public / Anon` | None | None (`HTTP 401`) | Read Public Catalog Only | **NO (HTTP 401)** | **NO** |

---

## Enforcement Layers

1. **Client / Gateway Layer (`src/lib/auth/middleware.ts` & `src/lib/server/session.ts`):**
   - Directs users to appropriate portal tab based on verified staff role.
   - Rejects unauthenticated requests with `401 Unauthorized`.
   - Requires anti-CSRF token on mutating HTTP methods.

2. **Control Plane Layer (`src/admin-service/auth.ts`):**
   - Independent cryptographic session verification (`verifySessionCookie(cookie, true)`).
   - Rejects unverified email accounts (`403 Forbidden`).
   - Rejects non-staff accounts (`403 Forbidden`).
   - Restricts mutation operations strictly to `super_admin` and `researcher`.
