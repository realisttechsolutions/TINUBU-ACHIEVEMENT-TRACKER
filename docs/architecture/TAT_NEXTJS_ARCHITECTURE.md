# Tinubu Achievement Tracker V2: Next.js App Router Architecture
## Technical Blueprint & Directory Layout

**Version:** 2.0.0 (Post-Mission 09)  
**Framework:** Next.js 15.2.9  
**Runtime:** Node.js 18 / 20 (Firebase App Hosting on Google Cloud Run)  

---

## 1. Directory Structure

```
TINUBU ACHIEVEMENTS TRACKER/
├── apphosting.yaml                   # Firebase App Hosting compute & runtime configuration
├── next.config.mjs                   # Next.js build options, image domains, 308 legacy redirects
├── package.json                      # Next.js scripts and unified dependencies
├── tsconfig.json                     # Path aliasing (@/* -> ./src/*) and TS compiler settings
├── docs/                             # Architectural, mission, research, and governance documentation
│   ├── architecture/                 # Architecture Decision Records (ADR-001) & System blueprints
│   ├── deployment/                   # Firebase App Hosting deployment readiness guides
│   ├── handoffs/                     # Cross-agent handoff contracts (Codex E01, Research M02)
│   ├── missions/                     # Mission execution records
│   ├── qa/                           # Visual parity, route validation, and accessibility reports
│   └── research/                     # Canonical Research Contract v1.1.2
├── public/                           # Static assets, logos, icons, SVG map layers
│   ├── assets/                       # Brand imagery, national seal, OG default cards
│   ├── favicon.ico                   # Platform favicon
│   └── og-image.jpg                  # Default OpenGraph preview banner
├── scripts/                          # Deterministic research validator scripts (v1.1.2)
└── src/
    ├── app/                          # Next.js 15 App Router (v15.2.9) (Root Server Layout & Routes)
    │   ├── layout.tsx                # Root HTML layout, font preconnects, SEO metadata
    │   ├── providers.tsx             # Client boundary (React Query, Theme, Language, Tooltips)
    │   ├── loading.tsx               # Global skeleton loading state
    │   ├── error.tsx                 # Global error boundary with recovery action
    │   ├── not-found.tsx             # Global 404 page
    │   ├── page.tsx                  # Public Homepage (/)
    │   ├── sitemap.ts                # Dynamic XML Sitemap generator (/sitemap.xml)
    │   ├── robots.ts                 # Dynamic robots.txt generator (/robots.txt)
    │   ├── api/
    │   │   └── health/route.ts       # Healthcheck API route (/api/health)
    │   ├── achievements/
    │   │   ├── page.tsx              # Achievements Catalogue (/achievements)
    │   │   └── [slug]/page.tsx       # Achievement Detail with SSG + OpenGraph (/achievements/:slug)
    │   ├── dashboard/page.tsx        # Executive Dashboard (/dashboard)
    │   ├── data/page.tsx             # Data Explorer (/data)
    │   ├── data-sources/page.tsx     # Methodology & Data Sources (/data-sources)
    │   ├── downloads/page.tsx        # Downloads & Open Data (/downloads)
    │   ├── impact-map/page.tsx       # Nigeria Geographic Impact Map (/impact-map)
    │   ├── policies/
    │   │   ├── page.tsx              # Statutory Policies Catalogue (/policies)
    │   │   └── [slug]/page.tsx       # Policy Detail with SSG (/policies/:slug)
    │   ├── programmes/page.tsx       # National Programmes Catalogue (/programmes)
    │   ├── projects/page.tsx         # Capital Infrastructure Projects (/projects)
    │   ├── sectors/
    │   │   ├── page.tsx              # 15 Canonical Sectors Directory (/sectors)
    │   │   └── [slug]/page.tsx       # Sector Detail with SSG (/sectors/:slug)
    │   ├── sources/
    │   │   ├── page.tsx              # Source Directory (/sources)
    │   │   └── [slug]/page.tsx       # Source Record Detail (/sources/:slug)
    │   ├── states/
    │   │   ├── page.tsx              # 36 States + FCT Catalogue (/states)
    │   │   └── [slug]/page.tsx       # Subnational State Profile with SSG (/states/:slug)
    │   ├── timeline/page.tsx         # National Policy Timeline (/timeline)
    │   └── corrections/page.tsx      # Audited Corrections Register (/corrections)
    ├── adapters/                     # Data Access Layer & ViewModel Normalizer
    │   ├── dataAdapter.ts            # Canonical Data Adapter serving all views & pages
    │   └── types.ts                  # Canonical ViewModels, ENUMs & Classification types
    ├── components/                   # Reusable UI Component Library
    │   ├── achievements/             # Achievement cards, grids, filters, evidence claim drawers
    │   ├── common/                   # Badges (Status, Source, Classification), Breadcrumbs, Errors
    │   ├── dashboard/                # Macro indicators, fiscal charts, executive metrics
    │   ├── geography/                # NigeriaMapSvg, GeoZoneSelect, StateImpactCard
    │   ├── layout/                   # AppShell, Navbar, Footer, MobileNav, SearchModal
    │   ├── policies/                 # Policy cards, authority badges, gazette linkers
    │   ├── timeline/                 # Chronological milestone feeds, stage progress bars
    │   └── ui/                       # Accessible Tailwind/Radix UI primitives
    ├── contexts/                     # Client React Contexts (Language, Search, Filter)
    ├── data/                         # Local Seed Data conforming to Research Contract v1.1.2
    ├── i18n/                         # Internationalization engine (English, Hausa, Yoruba, Igbo)
    ├── lib/                          # Core Utilities & Navigation Bridge
    │   ├── navigation.tsx            # Universal Next.js / Router navigation bridge
    │   └── utils.ts                  # ClassName mergers (clsx/tailwind-merge)
    ├── views/                        # Page-level interactive views (Client Components)
    └── __tests__/                    # Vitest Test Suite (Unit & Component tests)
```

---

## 2. Rendering Strategy

- **Server Components (Default):** All `src/app/**/layout.tsx` and `src/app/**/page.tsx` files are Server Components responsible for generating static metadata, extracting route params, and generating static parameters (`generateStaticParams`).
- **Client Components (`'use client'`):** All interactive components in `src/views/` and `src/components/` operate as client components mounted within `<Suspense>` boundaries.
- **Incremental Static Regeneration / SSG:** Core catalogue and detail pages are pre-rendered at build time across all 82 entity paths, with dynamic on-demand SSR fallback for runtime query parameter filtering.