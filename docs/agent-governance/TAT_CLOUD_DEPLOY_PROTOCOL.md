# TAT Cloud Deployment Protocol: Cloud Run, App Hosting & Provenance Verification

**Authority:** Command Centre & Cloud Infrastructure  
**Classification:** Canonical Deployment Standard  
**Scope:** Google Cloud Run, Firebase App Hosting, Secret Manager, & Artifact Registry

---

## 1. Pre-Deployment Gate: Four-Way Provenance Synchronization

No cloud deployment or rollout may be initiated until the following invariant is proven:

$$\text{Git Local SHA} = \text{Git Remote SHA} = \text{Target Deployment SHA}$$

### Pre-Deployment Verification Checklist
- [ ] Working tree is clean (`git status` shows 0 uncommitted changes).
- [ ] Local commit SHA matches remote origin branch (`git rev-parse HEAD == git rev-parse origin/<branch>`).
- [ ] Target environment is explicitly specified (`tinubu-achievement-stg`).
- [ ] Automated local test suites (`vitest`, `tsc --noEmit`) pass with 0 errors.

---

## 2. Cloud Run Deployment Standard (`tat-admin-api-staging`)

1. **Service Identity:** `tat-admin-api-staging` (us-central1).
2. **Build Process:**
   - Standalone bundling of `src/admin-service/` via esbuild.
   - Container image build via Google Cloud Build with tag format `m10h-<sha>-<timestamp>`.
   - Storage in Artifact Registry / Container Registry (`gcr.io/tinubu-achievement-stg/tat-admin-api-staging`).
3. **Deployment Command Discipline:**
   - Trigger ONE deployment per cycle.
   - Wait for Cloud Run revision to reach `READY` state.
   - Confirm 100% traffic allocation to the newly deployed revision.
   - Verify invoker IAM policy restricts ingress to App Hosting compute and authorized staff.

---

## 3. Firebase App Hosting Rollout Standard (`tat-staging`)

1. **Backend Identity:** `tat-staging` (us-central1).
2. **Rollout Trigger:**
   - Trigger rollout using the verified Git commit SHA.
   - Monitor Cloud Build and App Hosting rollout lifecycle until status is `SUCCEEDED`.
3. **Post-Rollout Verification:**
   - Confirm build ID and rollout ID.
   - Confirm deployed codebase commit matches certified SHA.
   - Confirm 100% traffic allocation to the new build.

---

## 4. Post-Deployment Provenance Certification

Following both deployments, the agent must execute read-only API calls to verify:

```
Git Local SHA:      <SHA>
Git Remote SHA:     <SHA>
Cloud Run Revision: tat-admin-api-staging-XXXXX
Cloud Run Image:    gcr.io/...:m10h-<sha>-<ts>
Cloud Run Digest:   sha256:<digest>
Cloud Run Traffic:  100%
App Hosting Build:  build-YYYY-MM-DD-XXX
App Hosting Commit: <SHA>
App Hosting Status: SUCCEEDED
App Hosting Traffic:100%
```

If any SHA discrepancy exists, **HALT immediately**. Do not proceed to live workflow certification.
