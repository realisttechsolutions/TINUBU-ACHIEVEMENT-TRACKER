# ADR-003: Production Framework Freeze & Security Maintenance Policy

## Status
**ACCEPTED & FROZEN** (Development Mission 09B)

## 1. Context
The Tinubu Achievement Tracker V2 has progressed through architecture migration (Mission 09: React/Vite → Next.js App Router) and subsequent hardening (Mission 09A: Next.js 15.2.9, Mission 09B: Next.js 15.5.21 security patch). To prevent framework churn and ensure engineering focus on the upcoming database integration, editorial administration, and AI features (Missions 10–18), the core frontend and runtime framework is formally frozen.

## 2. Decision: Production Framework Freeze Baseline
- **Core Framework:** Next.js `15.5.21` (Maintenance-LTS)
- **UI Engine:** React `18.3.1` / React DOM `18.3.1`
- **TypeScript:** `5.5.3` (Strict mode)
- **Hosting Target:** Firebase App Hosting / Google Cloud Run (`apphosting.yaml`)
- **Testing Engine:** Vitest `4.0.18` + JSDOM `27.4.0`
- **Linting:** ESLint 9 + `eslint-config-next@15.5.21`

## 3. Firebase App Hosting Support Classification
- Firebase App Hosting maintains officially active adapter support for Next.js 15.2.x, and executes Next.js 15.5.x under its documented preview/best-effort framework-version policy.
- Local production build and Cloud Run server simulation have certified that all 82 pre-rendered routes, dynamic API endpoints (`/api/health`), and static assets compile and serve without error.

## 4. Framework Security Update Policy
1. **Freeze Scope:** No discretionary framework upgrades or migrations may occur during Missions 10 through 13.
2. **Exception Criteria:** Upgrades are permitted only for:
   - High or Critical CVE security advisories officially published for Next.js 15.x.
   - Critical vendor-level breaking changes in Firebase App Hosting buildpacks.
   - Fatal runtime blockers verified in staging.
3. **Review Cadence:** Framework dependencies will be audited monthly or upon receipt of formal vendor security bulletins.
4. **Mandatory Verification:** Any future security patch must execute the full 26-test regression suite, research schema validator, and `next build` static page generation before staging deployment.