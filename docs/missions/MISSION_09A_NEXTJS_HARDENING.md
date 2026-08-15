# Development Mission 09A: Next.js Security, Firebase App Hosting Compatibility & Production Hardening

## 1. Mission Overview
- **Mission ID:** DEV-M09A
- **Branch:** `architecture/mission-09a-nextjs-hardening`
- **Worktree:** `TINUBU ACHIEVEMENTS TRACKER-M09A`
- **Starting Point:** Mission 09 completion commit (`1352d93`)
- **Execution Purpose:** Resolve framework version vulnerabilities, upgrade to a modern security-supported Next.js release with documented Firebase App Hosting compatibility, audit the Universal Navigation Bridge, verify complete Evidence/Trust routes, and produce production framework certification before Mission 10 data layer introduction.

## 2. Framework Version Selection & ADR-002
- **Previous Version:** Next.js `14.2.24` (deprecated, vulnerable to CVE-2025 Next.js cache poisoning/middleware advisories).
- **Target Selected:** Next.js `15.2.9` (latest security-patched stable release in the active Firebase App Hosting supported 15.2.x line).
- **Justification:** Full compatibility with React 18 (`^18.2.0`), zero breaking changes to existing design tokens or Lucide icons, seamless integration with Firebase App Hosting buildpacks, native static site generation (`generateStaticParams`), and full CVE protection.

## 3. Scope of Modifications
1. **Next.js Dependency Upgrade:**
   - Upgraded `next` from `14.2.24` to `15.2.9`.
   - Added `eslint-config-next@15.2.9` for build-time validation.
2. **Async Route API Compliance (Next.js 15):**
   - Updated `generateMetadata` and `Page` component props to `Promise<{ slug: string }>` across all dynamic routes:
     - `src/app/achievements/[slug]/page.tsx`
     - `src/app/sectors/[slug]/page.tsx`
     - `src/app/states/[slug]/page.tsx`
     - `src/app/policies/[slug]/page.tsx`
     - `src/app/sources/[slug]/page.tsx`
3. **Next.js Config Modernization:**
   - Removed deprecated `swcMinify: true` key from `next.config.mjs`.
   - Retained strict redirect mapping and domains.
4. **Universal Navigation Bridge Hardening:**
   - Refactored `src/lib/navigation.tsx` to strictly follow React Rules of Hooks with top-level unconditional invocations.
   - Maintained full dual runtime compatibility for both Next.js App Router and Vitest/JSDOM testing environments.
5. **Linting & Code Quality:**
   - Updated `eslint.config.js` and `.eslintrc.json` for Next.js 15 core web vitals and strict TypeScript typechecking.

## 4. Verification & Validation Metrics
- **TypeScript:** 0 errors (`tsc --noEmit` exited with code 0).
- **Vitest Suite:** 26/26 tests passing (6 test files).
- **Research Foundation Validator:** 0 errors (44 documents, 19 schemas, 19 templates, 43 namespaces, 25/25 negative fixtures passing).
- **Next.js Production Build:** 82/82 static and SSG pages compiled and generated successfully with 0 errors.