# Firebase App Hosting Staging & Next.js 15.5.21 Report

## 1. Hosting Architecture & Framework Status

- **Framework**: Next.js `15.5.21` / React `18.3.1` (Frozen under ADR-003)
- **Target Platform**: Firebase App Hosting (Serverless Cloud Run Container)
- **Deployment Configuration**: `apphosting.yaml`
- **Route Pre-rendering**: 82 SSG Pages pre-rendered with static metadata
- **Static Assets**: 100% Verified, zero missing assets or broken chunks
- **Environment Isolation**: Staging backend decoupled from live production domain

## 2. Server Boundary & Database Connection
- `src/lib/firebase/sql-connect/server.ts` establishes connection to Cloud SQL PostgreSQL in App Hosting environment via `DATABASE_URL` secret.
- Public client bundle excludes all `firebase-admin` and privileged SQL Connect operations.
