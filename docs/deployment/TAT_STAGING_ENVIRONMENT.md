# Staging Environment & Infrastructure Configuration

## 1. Staging Cloud Resources

- **Google Cloud Project**: `tinubu-achievement-tracker-staging` (or approved existing staging project)
- **Region**: `us-central1`
- **Firebase SQL Connect Service**: `tinubu-achievements-tracker`
- **Cloud SQL Instance**: `tat-db-staging` (PostgreSQL 17, `db-f1-micro` or `db-custom-2-7680`)
- **App Hosting Backend**: `tinubu-achievements-tracker-staging`
- **Estimated Baseline Cost**: ~$25–$65/month depending on machine tier and active runtime.
