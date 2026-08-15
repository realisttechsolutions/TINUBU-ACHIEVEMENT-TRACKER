# Codex Mission 01 Firebase Authentication and Security Review

**Verdict:** Firebase Authentication is suitable, but the three-role Supabase proposal is insufficient and its RLS policies cannot be reused. Use coarse custom claims plus relational role assignments and enforce every SQL Connect operation server-side.

## Identity and role model

Use Firebase Authentication for human identities. Store `firebase_uid` as a unique, nullable field on `actor_profiles`; service/AI actors can exist without an Auth account. Never treat email address as a stable foreign key.

Use both mechanisms:

- **Custom claims:** small, coarse, latency-sensitive flags such as `staff: true`, `admin: true`, and optionally `publisher: true`. Claims are set only by a privileged Admin SDK process. They are limited to 1000 bytes and update only when a new ID token is issued or forced refreshed.
- **Relational `actor_roles`:** authoritative, auditable assignments with `actor_id`, `role_code`, scope, grantor, start/end times, revocation fields and reason. Connector mutations query this table using authorization lookups and redact the result.

Custom claims are a cache/gate, not the sole record of authorization. Role changes must update `actor_roles`, append an auditable decision, synchronize claims where needed, and revoke/refresh sessions for urgent revocation.

## Roles and capabilities

| Role | Draft/read internal | Create/edit | Review | Approve | Publish | Administer roles |
|---|---:|---:|---:|---:|---:|---:|
| Researcher | Assigned scope | Own/assigned drafts | No | No | No | No |
| Senior researcher | Research scope | Yes | Evidence quality | Medium-risk only when not author | No | No |
| Evidence reviewer | Relevant claims/sources | Evidence metadata only | Evidence and contradiction | Claim verification | No | No |
| Data reviewer | Relevant structured values | Taxonomy/data corrections | Schema, financial, beneficiary, dates | Data readiness | No | No |
| Editor | Editorial fields | Public copy | Language and qualification | Editorial readiness | No | No |
| Publisher | Approved package | Publication metadata only | Final gate | No self-authored high-risk approval | Yes | No |
| Administrator | All, including security logs | Emergency/admin operations | Access/configuration | No automatic editorial approval | Only with separate publisher role and recorded break-glass reason | Yes |

Roles are additive, but separation-of-duties constraints still apply. An administrator is not implicitly an evidence approver or publisher.

## Enforceable workflow controls

Every mutation must use a declared SQL Connect operation. Do not expose general update/delete operations.

- Public queries: `@auth(level: PUBLIC)` plus a filter equivalent to `publication_status IN (published, published_with_qualification)`, selecting public-safe fields only. A public query must never select internal notes, raw evidence locations, actor identifiers or restricted-file paths.
- Staff queries: `@auth(level: USER_EMAIL_VERIFIED)` plus role/scope lookup. `USER` by itself is authentication, not authorization.
- Draft mutation: require researcher role and assign `created_by` from `auth.uid`, never a client-supplied UID.
- Review mutation: require matching reviewer role and write an immutable `review_decisions` row in the same transaction.
- Publish mutation: use `@transaction`; verify required approvals, no unresolved critical contradiction, no stale/restricted evidence leak, and `publisher != author` for high/critical records before changing publication state.
- Role/admin mutations: `NO_ACCESS` to clients; run only through Admin SDK tooling with IAM and audit logs.
- Restricted file access: server-mediated, short-lived signed URL after a fresh relational authorization check. Storage Rules alone cannot read SQL Connect role tables.

SQL Connect operations default to `NO_ACCESS` when no `@auth` is declared. Keep that default for administrative imports, bulk updates, role changes and sensitive exports.

## Proposed state and approval controls

Publication state is workflow state, not implementation state:

```text
draft -> in_review -> changes_requested -> approved -> published
                                      \-> rejected
published -> corrected -> published
published -> withdrawn | archived
```

Require at least:

- Medium risk: one reviewer distinct from author.
- High risk: evidence reviewer and editor, with publisher distinct from author.
- Critical risk: two distinct senior approvals plus publisher; no actor can satisfy two required approval slots for the same revision.
- Any material post-publication change: new review decision and correction record.
- Break-glass administration: reason, time-bounded action, actor, affected record and follow-up review.

Enforce uniqueness such as `(record_id, record_version, gate_code, reviewer_id)` and query the distinct reviewers within the transactional publish operation.

## Public/internal/restricted boundary

The existing model relies on row filtering but mixes public and internal columns. Generated operations should instead expose explicit projections:

- Public: published title/summary/body, classifications, qualified claims, public source citations, public geographies, public metrics and public correction notices.
- Internal: researcher notes, review rationale, duplicate/contradiction work, actor IDs, unpublished drafts, ingestion errors and source capture metadata.
- Restricted: security-sensitive locations, embargoed documents, personal data, protected source files, access logs and secrets.

Do not depend on frontend TypeScript types to hide fields. If an operation selects a field, a malicious client can receive it.

## Threats and controls

| Threat | Required control |
|---|---|
| Client passes another user's ID | Use `auth.uid` server expression; never trust a UID argument. |
| Authenticated user calls broad mutation | No generic CRUD connector; allowlisted operations with role and record-scope checks. |
| Stale custom claim keeps privilege | Relational lookup for sensitive operations; token refresh/revocation on urgent role changes. |
| Researcher self-publishes a high-risk claim | Transactional distinct-actor approval check. |
| Public query leaks internal columns | Separate public connector fragments/projections and automated response-shape tests. |
| Admin SDK bypasses connector auth | Separate service account, least-privilege IAM, no browser credentials, audit every operation. |
| Automated importer overwrites reviewed data | Staging/diff/approval workflow, idempotency keys, immutable import batch and review history. |
| Bot or copied client abuses public operations | Firebase App Check, query limits, pagination, operation complexity bounds and monitoring. |
| Restricted source file is shared publicly | Private bucket, public-access prevention, server authorization and expiring signed URLs. |
| Role escalation is unaudited | Role mutation only through privileged tooling; append-only grant/revoke event and alert. |

## Supabase RLS migration warning

The proposal:

```sql
TO authenticated
USING (auth.jwt() ->> 'role' IN (...))
```

must not be translated mechanically. Supabase RLS attaches policy predicates to table access and can protect access through multiple APIs. SQL Connect authorizes the declared query/mutation operation. PostgreSQL users, IAM, Admin SDK, direct SQL tooling, and Storage have separate boundaries. Every connector operation needs its own review, and privileged access must be controlled independently.

## Verdict and gates

**CONDITIONAL PASS.** Firebase Authentication fits the MVP, provided that:

1. All seven roles and separation-of-duties rules are approved.
2. `actor_profiles`, `actor_roles`, `review_decisions` and publication transitions are part of the local schema prototype.
3. Public, staff and admin connector surfaces are separated and tested.
4. App Check is evaluated/enabled for public web client operations before production.
5. IAM, service accounts, token revocation, emergency access and audit retention are documented.

Official references: [SQL Connect authorization](https://firebase.google.com/docs/sql-connect/authorization-and-security), [Firebase custom claims](https://firebase.google.com/docs/auth/admin/custom-claims), [Firebase session management](https://firebase.google.com/docs/auth/admin/manage-sessions), and [Firebase App Check for web](https://firebase.google.com/docs/app-check/web/recaptcha-provider).
