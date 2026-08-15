# Tinubu Achievement Tracker V2 (2026 Edition)
## Nigeria's Official Evidence-Backed Public Progress Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.21-black?logo=next.js)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)](https://www.postgresql.org/)
[![Firebase SQL Connect](https://img.shields.io/badge/Firebase-SQL_Connect-amber?logo=firebase)](https://firebase.google.com/docs/data-connect)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-App_Hosting-amber?logo=google-cloud)](https://firebase.google.com/docs/app-hosting)
[![License](https://img.shields.io/badge/License-Proprietary-green)]()

The **Tinubu Achievement Tracker (TAT)** is Nigeria's authoritative, evidence-backed public progress platform tracking federal policy reforms, capital infrastructure projects, macroeconomic indicators, and institutional milestones for the administration of President Bola Ahmed Tinubu (2023–2026).

---

## 🏛️ Architecture Highlights

- **Framework:** Next.js `15.5.21` (App Router) + React `18.3.1` (Frozen under ADR-003)
- **Database Layer:** Google Cloud SQL for PostgreSQL 17 + Firebase Data Connect (SQL Connect)
- **Local Database Engine:** `@electric-sql/pglite` executing in-process PostgreSQL 17 for development and automated testing
- **Ingestion Pipeline:** Cryptographically verified, schema-validated, idempotent ingestion pipeline (`backend/ingestion/`)
- **Styling & Design System:** Tailwind CSS + Radix UI primitives with Glassmorphism, accessible dark/light modes, and national sovereign color palettes
- **Repository Facade:** Clean repository abstraction layer (`src/data/repositories/`) querying certified relational SQL Connect views
- **Evidentiary Standard:** 4-tier verification hierarchy linked to Federal Official Gazettes, Acts of the National Assembly, and NBS / CBN statutory data
- **Deployment:** Google Cloud Run containerized SSR via **Firebase App Hosting** (`apphosting.yaml`)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm 9+

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

### 4. Database & Ingestion CLI
```bash
# Verify research snapshot integrity (SHA-256 manifest)
node scripts/ingestion/verify-snapshot.mjs

# Validate dataset schemas, vocabulary, and foreign keys
node scripts/ingestion/validate-dataset.mjs

# Execute local database schema and fixture tests
node scripts/test-local-database.mjs

# Ingest research snapshot into relational database
node scripts/ingestion/import-m02.mjs

# Rollback a specific batch
node scripts/ingestion/rollback-batch.mjs [batch_id]
```

### 5. Test Suite & Verification
```bash
# Run Vitest test suite across frontend and database
npm run test:run

# Run TypeScript typecheck
npm run typecheck

# Build production Next.js bundle
npm run build
```

---

## 📊 Canonical Database Schema

The platform is backed by a 27-table relational database conforming to Research Contract v1.1.2:
- **Taxonomy & Geometry:** `sectors`, `geographic_units`
- **Institutions & RBAC:** `institutions`, `actor_profiles`, `actor_roles`
- **Core Entities:** `records`, `achievement_profiles`, `policy_details`, `project_details`, `programme_details`, `record_sectors`, `record_geography`
- **Evidence & Claims:** `sources`, `evidence_claims`, `claim_source_relationships`
- **Structured Observations:** `financial_records`, `beneficiary_records`, `indicators`, `indicator_observations`, `timeline_events`
- **Governance & Immutability:** `corrections`, `review_decisions`, `record_versions`, `research_batches`, `dataset_manifests`
