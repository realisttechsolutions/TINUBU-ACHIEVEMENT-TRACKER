# Codex Mission 01 Firebase Storage Review

**Verdict:** Cloud Storage for Firebase is optional for launch but appropriate for controlled source archives and managed images. It must not become the evidence metadata database, and no bucket should be provisioned until billing and retention are approved.

## What belongs in Storage

| Asset | MVP treatment | Visibility |
|---|---|---|
| Archived official PDFs/reports | Store only where archiving/copyright policy permits and preservation is necessary | Internal by default; public only when redistribution is lawful |
| Evidence snapshots | Store hashes and provenance; prefer a legal archive URL where sufficient | Internal or restricted |
| Security-sensitive or embargoed evidence | Avoid unless necessary; encrypt/access through server-mediated workflow | Restricted |
| Public editorial images | Hosting for versioned app assets; Storage when editorial upload lifecycle is needed | Public |
| Downloadable reports/datasets produced by TAT | Storage or Hosting based on size/release lifecycle | Public after publication |
| Raw web pages or copyrighted article bodies | Do not archive routinely | Not stored without approval |

Store minimal extracts, citation metadata, a lawful archive link, and a cryptographic hash where possible. Do not store copied article content merely for convenience.

## Bucket architecture

Use two physical buckets per Firebase environment if Storage is approved:

1. `public-assets`: only approved public images, reports and datasets. Public read may be allowed by narrow path; writes are staff/admin only.
2. `evidence-private`: internal and restricted source files. Enforce public access prevention. Ordinary staff access uses authenticated rules for coarse access or, preferably for restricted objects, a trusted service returning short-lived signed URLs after a SQL Connect role/scope check.

Within `evidence-private`, use prefixes such as `internal/{source_id}/{file_id}` and `restricted/{source_id}/{file_id}`. Prefixes are naming conventions, not directories or sufficient security boundaries.

The separation prevents a public rule edit from exposing the evidence vault. Staging and production buckets must also be separate.

## Canonical metadata

The SQL Connect `source_files` table is authoritative:

- `id`, `source_id`, `visibility_class`
- `bucket_name`, `object_path`, immutable object `generation`
- `file_kind` (`original`, `snapshot`, `extract`, `public_asset`)
- `content_type`, `byte_size`, `sha256`
- `copyright_status`, `retention_class`, `legal_hold`
- `captured_at`, `captured_by`, `published_at`
- `supersedes_file_id`, `deleted_at`, `deletion_reason`

Object custom metadata should contain only non-sensitive routing identifiers and content type. Firebase documentation recommends using a database for application metadata; do not duplicate review notes, roles or legal assessments into object metadata.

## Access controls

- Default deny.
- Validate allowed MIME types, size limits and object paths on upload.
- Prevent overwrite of evidence objects; create a new generation/file record instead.
- Public-assets writes require an editor/publisher claim and a corresponding approved database record.
- Internal reads require verified staff identity and least-privilege path rules.
- Restricted reads/writes are server-mediated because Storage Rules cannot query SQL Connect relational role assignments.
- Admin SDK/service accounts bypass Firebase Storage Rules; protect them with IAM and audit logs.
- Do not expose permanent download tokens for restricted evidence.

## Retention and resilience

- Enable soft-delete awareness; current Cloud Storage defaults include a seven-day soft-delete period, which has cost implications.
- Consider Object Versioning for the evidence bucket only after lifecycle cost analysis.
- Use lifecycle policies to expire superseded/noncurrent objects after the approved retention window, except objects under a legal hold.
- Keep public generated reports reproducible from database snapshots; do not rely on Storage as the only historical record.
- Test restore and evidence/hash verification, not merely upload/download.
- Document source takedown, copyright complaint, correction, and secure-deletion procedures.

## Billing

Cloud Storage for Firebase requires the Blaze pay-as-you-go plan as of 2026-02-03. Storage, operations, retrieval, egress, soft-deleted data, noncurrent versions and cross-region access can all affect cost. Choose a region compatible with data residency, latency and SQL Connect/Cloud SQL operations; set budgets before provisioning.

## Approval conditions

Storage is **CONDITIONAL PASS** after the project approves copyright/retention policy, bucket separation, visibility classification, database metadata, private access flow, cost owner and deletion/restore tests. Public app images can remain in the current static bundle until an editorial upload requirement exists.

Official references: [Firebase file metadata](https://firebase.google.com/docs/storage/web/file-metadata), [Storage Rules conditions](https://firebase.google.com/docs/storage/security/rules-conditions), [Storage billing requirement](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024), [public access prevention](https://cloud.google.com/storage/docs/public-access-prevention), [Object Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle), and [Object Versioning](https://cloud.google.com/storage/docs/object-versioning).
