# TAT Client Component Register & Boundary Audit
## Server vs Client Component Classification in Next.js App Router

**Status:** APPROVED  
**Date:** 2026-08-15  

---

## 1. Architectural Boundary Rules

Next.js App Router enforces strict separation between **Server Components** (rendered solely on the server or during build time) and **Client Components** (hydrated in the browser with interactive JavaScript).

### Boundary Invariants:
1. **App Shell & Layouts:** Root layouts (`src/app/layout.tsx`) and page entry points (`src/app/**/page.tsx`) remain **Server Components** to generate static HTML, metadata, and OpenGraph tags.
2. **Provider Boundary (`src/app/providers.tsx`):** All React Context providers (`QueryClientProvider`, `ThemeProvider`, `LanguageProvider`, `TooltipProvider`, `AppShell`) are encapsulated in a single Client Component boundary.
3. **Interactive Views (`src/views/*.tsx`):** All page views containing UI state, tabs, search inputs, modal triggers, and event handlers are explicitly declared with `'use client';` at the top of the file.
4. **No Server-to-Client Function Passing:** Server Components pass only serializable primitives/JSON objects across the boundary.

---

## 2. Component Boundary Register

| Component Category | Path / Files | Boundary Type | Interactivity Reason |
| :--- | :--- | :--- | :--- |
| **Root Layout** | `src/app/layout.tsx` | Server Component | Generates root HTML, preconnect links, SEO metadata |
| **Providers Boundary** | `src/app/providers.tsx` | Client Component (`'use client'`) | React Query cache, Theme context, Language context |
| **Page Entry Points** | `src/app/**/page.tsx` | Server Component | `generateMetadata`, `generateStaticParams`, SSR |
| **Dynamic Sitemaps** | `src/app/sitemap.ts`, `robots.ts` | Server Route | Generates search engine XML and robots.txt |
| **API Handlers** | `src/app/api/health/route.ts` | Server Route | Healthcheck response |
| **Page Views** | `src/views/*.tsx` (13 views) | Client Component (`'use client'`) | Filtering, searching, active tabs, modals, pagination |
| **Layout UI** | `src/components/layout/*` | Client Component (`'use client'`) | Navigation menus, search drawer, theme toggle, language picker |
| **Data Visualizations** | `src/components/dashboard/*` | Client Component (`'use client'`) | Recharts tooltip interaction, timeframe selectors |
| **Geographic Map** | `src/components/geography/NigeriaMapSvg.tsx` | Client Component (`'use client'`) | SVG state click, hover tooltips, zone filtering |
| **Evidence Drawers** | `src/components/achievements/*` | Client Component (`'use client'`) | Sheet modals, filter pill toggling, claim verification drawers |
| **UI Primitives** | `src/components/ui/*` (Radix UI) | Client Component (`'use client'`) | Dropdowns, dialogs, sheets, tooltips, toasts |