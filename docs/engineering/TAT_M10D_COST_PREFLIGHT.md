# M10D App Hosting Cost Preflight

**Date:** 2026-08-16  
**Project:** `tinubu-achievement-stg` only  
**Decision:** PASS — no unexpected material fixed incremental cost identified.

The staging project is already billing-enabled. The Cloud SQL instance is an existing M10C resource and its continuing cost is not caused by this deployment. M10D adds a low-traffic App Hosting backend with `minInstances: 0`, `maxInstances: 4`, one vCPU, 1,024 MiB memory, concurrency 40, and no custom domain.

## Expected incremental services

| Service | M10D use | Cost posture |
|---|---|---|
| Cloud Run | Dynamic Next.js runtime, scales to zero | No permanently warm instance; low test traffic is expected to use a small fraction of included usage. |
| Cloud Build | Initial build and occasional controlled rollouts | One build now; future builds occur only for deliberate staging rollouts while automatic rollouts are disabled. |
| Artifact Registry | Application build image | One staging image plus rollout history; monitor retained storage over time. |
| App Hosting delivery/bandwidth | Firebase-generated staging URL | Human QA traffic is expected to be far below normal no-cost egress allowances. |
| Cloud Logging | Build and runtime logs | Low-volume staging logs; avoid debug floods and monitor retention/ingestion. |
| Secret Manager | None | M10D introduces no secret. IAM database authentication requires no password. |
| Cloud Storage source bundle | None | GitHub-connected deployment avoids local-source upload storage. |

Firebase's current cost guide describes shared monthly no-cost allowances for the underlying services, including App Hosting outgoing bandwidth, Cloud Run compute and requests, Cloud Build minutes, Artifact Registry storage, and Cloud Logging ingestion. Allowances are generally evaluated at the billing-account or service scope described in the guide, so they are not guaranteed exclusively to this project. The official example characterizes an approximately 10,000-visit application as incurring virtually no cost; M10D staging traffic should be materially below that example.

This is a preflight estimate, not an invoice forecast. Actual charges depend on build frequency, image retention, request duration, egress, logging volume, and other projects sharing the billing account. The configuration creates no significant fixed App Hosting runtime cost because it can scale to zero. Cloud SQL remains the material existing staging cost and is unchanged.

## Controls

- Keep automatic rollouts disabled.
- Deploy only exact certified commits.
- Retain `minInstances: 0` and the four-instance ceiling.
- Do not add secrets, local-source uploads, a custom domain, or production resources in M10D.
- Inspect build duration, runtime errors, connection behavior, and available usage metrics after rollout.
- Review and prune obsolete artifacts/rollouts later under a separately authorized retention policy; do not delete resources in M10D.

## Official sources

- [Firebase App Hosting costs](https://firebase.google.com/docs/app-hosting/costs)
- [App Hosting configuration](https://firebase.google.com/docs/app-hosting/configure)
- [App Hosting rollouts](https://firebase.google.com/docs/app-hosting/rollouts)
- [App Hosting logging](https://firebase.google.com/docs/app-hosting/logging)

## Gate result

Expected incremental recurring cost is consistent with normal low-traffic staging usage. The cost gate passes; resource creation remains contingent on the technical predeployment suite.
