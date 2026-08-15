# ADR-002: Next.js Production Version Selection & Firebase App Hosting Compatibility

## Status
**ACCEPTED & CERTIFIED** (Development Mission 09A)

## Context
Development Mission 09 successfully migrated the Tinubu Achievement Tracker V2 from Vite + React Router to Next.js App Router. However, the initial target used was Next.js `14.2.24`, which reached maintenance deprecation and contained reported security advisories (e.g. Next.js cache poisoning and middleware header vulnerabilities). Additionally, Firebase App Hosting maintains active buildpack support for Next.js 15.2.x.

## Decision
Upgrade the platform foundation to **Next.js 15.2.9** (the latest security-patched stable release in the 15.2.x supported series).

## Consequences & Mitigations
1. **Async Dynamic Route Parameters:** Next.js 15 introduces async `params` and `searchParams` on page components. All dynamic route entry points (`achievements/[slug]`, `sectors/[slug]`, `states/[slug]`, `policies/[slug]`, `sources/[slug]`) have been updated to `await params`.
2. **Build Configuration:** Deprecated `swcMinify` configuration removed from `next.config.mjs` as SWC minification is enabled natively.
3. **Hosting Target:** Firebase App Hosting seamlessly recognizes Next.js 15.2.x buildpacks and containerizes via Cloud Run (`apphosting.yaml`).
4. **Zero Supabase Policy:** Maintained 100% adherence to the Google/Firebase ecosystem invariant with 0 active Supabase dependencies.