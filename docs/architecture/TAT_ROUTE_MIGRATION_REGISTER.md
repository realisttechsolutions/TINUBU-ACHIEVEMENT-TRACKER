# TAT Route Migration Register (Vite React Router → Next.js App Router)
## Complete Route Mapping, Rendering Strategy & Legacy Redirect Matrix

**Status:** AUDITED & VALIDATED  
**Last Updated:** 2026-08-15  

---

## 1. Canonical App Router Matrix

| Public Path | App Router File | Rendering Strategy | Pre-rendered Static Count | Dynamic Params / Queries |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Static (SSG) | 1 | None |
| `/dashboard` | `src/app/dashboard/page.tsx` | Static (SSG) | 1 | `?timeframe=`, `?sector=` |
| `/achievements` | `src/app/achievements/page.tsx` | Static (SSG) | 1 | `?sector=`, `?status=`, `?search=` |
| `/achievements/[slug]` | `src/app/achievements/[slug]/page.tsx` | SSG (`generateStaticParams`) | 6 pilot achievements | `slug: string` |
| `/sectors` | `src/app/sectors/page.tsx` | Static (SSG) | 1 | None |
| `/sectors/[slug]` | `src/app/sectors/[slug]/page.tsx` | SSG (`generateStaticParams`) | 15 canonical sectors | `slug: string` |
| `/states` | `src/app/states/page.tsx` | Static (SSG) | 1 | `?zone=` |
| `/states/[slug]` | `src/app/states/[slug]/page.tsx` | SSG (`generateStaticParams`) | 37 states + FCT | `slug: string` |
| `/policies` | `src/app/policies/page.tsx` | Static (SSG) | 1 | `?type=`, `?status=`, `?sector=` |
| `/policies/[slug]` | `src/app/policies/[slug]/page.tsx` | SSG (`generateStaticParams`) | 3 canonical policies | `slug: string` |
| `/impact-map` | `src/app/impact-map/page.tsx` | Static (SSG) | 1 | `?state=`, `?zone=` |
| `/projects` | `src/app/projects/page.tsx` | Static (SSG) | 1 | `?status=`, `?sector=` |
| `/programmes` | `src/app/programmes/page.tsx` | Static (SSG) | 1 | `?beneficiary=`, `?stage=` |
| `/timeline` | `src/app/timeline/page.tsx` | Static (SSG) | 1 | `?year=`, `?quarter=` |
| `/data-sources` | `src/app/data-sources/page.tsx` | Static (SSG) | 1 | None |
| `/sources` | `src/app/sources/page.tsx` | Static (SSG) | 1 | `?tier=`, `?type=` |
| `/sources/[slug]` | `src/app/sources/[slug]/page.tsx` | Dynamic (SSR) | Dynamic | `slug: string` |
| `/corrections` | `src/app/corrections/page.tsx` | Static (SSG) | 1 | `?status=` |
| `/data` | `src/app/data/page.tsx` | Static (SSG) | 1 | `?dataset=` |
| `/downloads` | `src/app/downloads/page.tsx` | Static (SSG) | 1 | `?format=`, `?sector=` |
| `/sitemap.xml` | `src/app/sitemap.ts` | Dynamic XML Route | 1 | XML Sitemap Index (82+ URLs) |
| `/robots.txt` | `src/app/robots.ts` | Static Text Route | 1 | Crawling Rules & Sitemap pointer |
| `/api/health` | `src/app/api/health/route.ts` | Dynamic JSON Route | 1 | Health status & timestamp |

**Total Static / SSG Pre-rendered Pages at Build Time:** **82 / 82**

---

## 2. Legacy Route 308 Permanent Redirects

Configured in `next.config.mjs` with `permanent: true` (HTTP 308):

| Legacy Vite Route | Target Next.js Route | Status Code | Preservation Rationale |
| :--- | :--- | :--- | :--- |
| `/economic-reforms` | `/sectors/economy` | 308 Permanent | V1 bookmark preservation |
| `/security-progress` | `/sectors/security` | 308 Permanent | V1 bookmark preservation |
| `/infrastructure` | `/sectors/infrastructure` | 308 Permanent | V1 bookmark preservation |
| `/social-services` | `/sectors/social-services` | 308 Permanent | V1 bookmark preservation |
| `/policy-timeline` | `/timeline` | 308 Permanent | Canonical navigation consolidation |
| `/map` | `/impact-map` | 308 Permanent | Standardized route naming |