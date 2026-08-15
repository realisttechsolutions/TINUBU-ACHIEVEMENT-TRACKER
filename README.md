# Tinubu Achievement Tracker V2 (2026 Edition)
## Nigeria's Official Evidence-Backed Public Progress Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.24-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Firebase_App_Hosting-amber?logo=google-cloud)](https://firebase.google.com/docs/app-hosting)
[![License](https://img.shields.io/badge/License-Proprietary-green)]()

The **Tinubu Achievement Tracker (TAT)** is Nigeria's authoritative, evidence-backed public progress platform tracking federal policy reforms, capital infrastructure projects, macroeconomic indicators, and institutional milestones for the administration of President Bola Ahmed Tinubu (2023–2026).

---

## 🏛️ Architecture Highlights

- **Framework:** Next.js 15.5.21 (App Router) with full SSR / SSG / dynamic rendering
- **Styling & Design System:** Tailwind CSS + Radix UI primitives with Glassmorphism, accessible dark/light modes, and national sovereign color palettes
- **Data Facade:** Universal Data Adapter (`src/adapters/dataAdapter.ts`) strictly conforming to Research Contract v1.1.2
- **Deployment:** Google Cloud Run containerized SSR via **Firebase App Hosting** (`apphosting.yaml`)
- **Evidentiary Standard:** 4-tier verification hierarchy linked to Federal Official Gazettes, Acts of the National Assembly, and NBS / CBN statutory data
- **Internationalization:** Multi-lingual support (English, Hausa, Yoruba, Igbo)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm 9+

### 2. Installation
```bash
git clone https://github.com/realisttechsolutions/TINUBU-ACHIEVEMENT-TRACKER.git
cd "TINUBU ACHIEVEMENTS TRACKER"
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Validation & Testing

```bash
# 1. Typecheck the entire codebase
npm run typecheck

# 2. Run unit and component test suites
npm run test:run

# 3. Validate Research Contract Schemas & Test Fixtures (v1.1.2)
npm run validate:research

# 4. Compile optimized Next.js production build (82 pre-rendered pages)
npm run build
```

---

## 📁 Project Structure

```
├── apphosting.yaml                   # Firebase App Hosting compute config
├── next.config.mjs                   # Next.js config & 308 legacy redirects
├── docs/                             # Architecture (ADR-001), Research v1.1.2 & QA reports
├── src/
│   ├── app/                          # Next.js App Router (Layouts, Pages, Sitemaps, Routes)
│   ├── adapters/                     # Data Access Layer & Type Mappings
│   ├── components/                   # UI Component Library (Achievements, Maps, Layouts)
│   ├── contexts/                     # React Contexts (Language, Search, Themes)
│   ├── data/                         # Local Seed Data conforming to Research Schemas
│   ├── lib/                          # Universal Navigation Adapter & Utilities
│   └── views/                        # Page-level interactive views
```

---

## 🛡️ Strategic Platform Mandate (ADR-001)

The Tinubu Achievement Tracker uses the **Google Cloud / Firebase Enterprise Ecosystem**:
- Next.js 15 App Router (v15.5.21 - Maintenance LTS Frozen) on **Firebase App Hosting** (Google Cloud Run)
- **Firebase Firestore** & **Google Cloud Storage**
- **Firebase Authentication** with Claims-based RBAC
- **Google Cloud Vertex AI** (Gemini 1.5 Pro) for Grounded AI Search

*Supabase is permanently excluded from the platform architecture.*

---

## 📜 License & Governance

Copyright © 2026 Realist Tech Solutions. All rights reserved.  
Governed under the [Tinubu Achievement Tracker Project Constitution](docs/TAT_PROJECT_CONSTITUTION.md).