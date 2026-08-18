---
name: tat-deployment-certification
description: 4-way source provenance verification protocol (Git local == Git remote == Cloud Run == App Hosting) for TAT staging certifications.
---

# TAT Deployment Certification Skill

## 4-Way Provenance Synchronization Checklist

### 1. Invariant Definition
Prior to running live certification suites, the following four artifacts must be proven to match the certified commit SHA:

$$\text{Git Local} = \text{Git Remote} = \text{Cloud Run Source} = \text{App Hosting Build Commit}$$

### 2. Verification Protocol
1. **Git Local & Remote:**
   ```bash
   git rev-parse HEAD
   git rev-parse origin/<branch>
   ```
2. **Cloud Run Provenance:**
   Query GCP Cloud Run API to retrieve:
   - Latest Ready Revision Name.
   - Deployed Image URI and Digest (`sha256:...`).
   - Image label / build tag containing the certified SHA.
   - Traffic allocation (100%).
3. **App Hosting Provenance:**
   Query Firebase App Hosting API to retrieve:
   - Build ID and Rollout ID.
   - Build Source Codebase Commit SHA.
   - Rollout State (`SUCCEEDED`).
   - Traffic allocation (100%).

### 3. Hard Stop on Mismatch
If any discrepancy exists across the four sources:
- **STOP immediately.**
- Do NOT begin live workflow testing.
- Report the exact mismatch to Command Centre.
