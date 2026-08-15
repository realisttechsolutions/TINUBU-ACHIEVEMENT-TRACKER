# TAT Authorization Model

Status: design and local data structures only. Production Firebase Authentication is not configured in E01.

## Identity chain

```text
Firebase Authentication identity
        -> actor_profiles.firebase_uid
        -> active actor_roles + scope
        -> operation policy and separation-of-duties checks
        -> append-only review/publication audit
```

Firebase UID is an application identity mapping, not a research-domain primary key. UUID actor profiles remain stable across identity-provider changes. Roles carry global, sector, institution or geography scope and grant/revocation times.

## Outcomes

| Principal | Read public | Read internal in scope | Draft/change research | Review/decide | Edit presentation | Publish | Administer identities |
|---|---:|---:|---:|---:|---:|---:|---:|
| PUBLIC | Yes | No | No | No | No | No | No |
| RESEARCHER | Yes | Yes | Yes | No final approval | No | No | No |
| REVIEWER | Yes | Yes | No silent evidence rewrite | Yes, append decision | No | No | No |
| EDITOR | Yes | Approved internal | No evidence rewrite | Editorial gate | Yes | No | No |
| PUBLISHER | Yes | Publication queue | No evidence rewrite | Human/publication gate | Limited qualification | Yes, audited | No |
| ADMINISTRATOR | Yes | Operationally required | No implicit research power | No implicit review | No implicit edit | **No implicit publish** | Yes |

`REVIEWER` covers evidence/data reviewer responsibilities; exact role codes remain `evidence_reviewer` and `data_reviewer`. Senior researchers may assign/coordinate research work but do not gain publication power automatically.

## Separation of duties

- Researchers create or revise drafts but cannot publish.
- Reviewers append decisions and correction requests; they cannot silently mutate the evidence they reviewed.
- Editors control presentation/readiness, not evidentiary truth.
- Publishers act only on records that passed required gates at the current revision.
- Administrator and publisher are deliberately separate grants.
- High/critical-risk claims require the configured evidence/human approval gates and cannot be self-approved by the submitter.
- Scope checks apply after role checks; a sector reviewer cannot approve outside that sector.

## Publication transaction

A future trusted server action must lock the record revision, verify all required decisions belong to that revision, verify claim/source public eligibility, confirm publisher role/scope and independence requirements, append the publication decision/version, then update explicit publication fields in one transaction. Merely having a record, an Auth session or `is_public=true` is insufficient.

## Connector posture

- `tat-public`: only allowlisted operations with publication predicates; anonymous access is acceptable solely for those results.
- `tat-staff`: every operation is `NO_ACCESS` in E01. Future access should prefer trusted server-side calls or narrowly scoped, expression-based SQL Connect authorization backed by verified claims and database role checks.
- Ingestion: trusted local/server process only; never a browser mutation.

## Audit and revocation

Every decision records actor, gate, revision, rationale, risk and time. Corrections, decisions and versions are append-only. Role revocation is timestamped with a reason; authorization evaluates current, unrevoked assignments. Authentication logs alone are not the research audit trail.

## Production prerequisites

Create separate staging/production Auth tenants/projects, define token/claim lifecycle, implement server-side role lookup and scope evaluation, require recent authentication for privileged actions, configure App Check/rate limits, test the full outcome matrix including negative cases, and document incident/revocation procedures. None of these actions is authorized by E01.
