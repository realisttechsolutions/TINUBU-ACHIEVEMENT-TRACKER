---
name: tat-cloud-change
description: Cloud Run, Firebase App Hosting, and Cloud SQL environment targeting and provenance checklist for TAT.
---

# TAT Cloud Change Skill

## Cloud Resource & Deployment Checklist

### 1. Environment Identification
- [ ] Confirm staging project is `tinubu-achievement-stg`.
- [ ] Confirm production (`tinubu-achievement-tracker`) is NOT targeted without explicit written authorization.
- [ ] Confirm location is `us-central1`.

### 2. Pre-Deployment Provenance Gate
- [ ] Verify working tree is clean (`git status`).
- [ ] Verify local SHA == remote SHA (`git rev-parse HEAD == git rev-parse origin/<branch>`).
- [ ] Ensure local automated tests and typechecks pass.

### 3. Sequential Deployment Execution
- [ ] Deploy Cloud Run service `tat-admin-api-staging` ONCE.
- [ ] Wait for revision to become `READY` and receive 100% traffic.
- [ ] Deploy App Hosting backend `tat-staging` ONCE.
- [ ] Wait for rollout to reach `SUCCEEDED` and receive 100% traffic.

### 4. Post-Deployment Verification
- [ ] Verify Cloud Run revision, container image digest, and deployed source SHA.
- [ ] Verify App Hosting build ID, rollout state, and codebase commit SHA.
- [ ] Prove 4-way SHA alignment before executing live cloud tests.
