# Codex Mission 01 Firebase Hosting Review

**Verdict:** Firebase Hosting is the correct future host for the existing React 18 + Vite SPA. No Hosting configuration or deployment was created in this audit.

## Repository fit

- `npm run build` targets Vite and produces `dist/`.
- The application uses client-side React Router routes, so a catch-all rewrite to `/index.html` is required after static files are considered.
- Firebase Hosting supplies HTTPS, a global CDN, custom domains, preview channels, release history and rollback without requiring a runtime server for the current application.
- The current build succeeds when the local Vite entry point is invoked directly. It warns that the main `index` chunk is over 500 kB and should be code-split; this is a performance issue, not a Hosting blocker.

## Future configuration requirements

The future `firebase.json` should conceptually include:

- `public: "dist"`.
- Ignore source/configuration files.
- A final `** -> /index.html` rewrite for SPA navigation.
- `Cache-Control: no-cache` for `index.html` so deployments are discovered promptly.
- Long-lived immutable caching for hashed files under `dist/assets`.
- Security headers appropriate to the app: Content-Security-Policy after source inventory, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and frame restrictions.
- No dynamic Function/Cloud Run rewrite unless a specific server route is approved.

Do not create this configuration until the Firebase project/environment decision is approved; running `firebase init hosting` can overwrite an existing Hosting section.

## Delivery workflow

| Event | Target | Control |
|---|---|---|
| Pull request | Expiring preview channel | Build/test first; staging Firebase config only; never production secrets or restricted data. |
| Merge to main | Staging live channel/site | Automatic after required reviews and checks. |
| Release tag/manual approval | Production live channel/site | Explicit approval; immutable artifact or verified rebuild; environment-specific config. |
| Incident | Prior production release | Roll back through Hosting release history, then investigate forward. |

Use GitHub Actions with Workload Identity Federation or another short-lived credential pattern where supported; avoid a long-lived service-account JSON secret. Limit deployment identity to the relevant project/site.

Firebase's official GitHub integration can create a preview channel for each pull request and update a stable preview URL. Preview URLs use the backend resources configured in that Firebase project, so the preview workflow must target the staging project.

## Environment variables

- Only public Firebase web configuration belongs in Vite `VITE_*` variables. Firebase web API keys identify the project; they do not authorize database access.
- Never place Admin SDK credentials, service-account keys, database passwords or restricted signed-URL keys in `VITE_*` variables.
- Validate that production builds do not contain staging IDs and vice versa.
- Treat SQL Connect connector authorization, Firebase Auth and App Check as the security controls—not obscurity of web configuration.

## Cache and rollback

Firebase Hosting automatically caches static content on its CDN and clears cached content on redeploy. Hashed Vite assets may use `public,max-age=31536000,immutable`; `index.html`, manifest/service-worker coordination and rapidly changing metadata need short or no-cache policies. The existing PWA/service worker must be tested so it does not keep an obsolete application shell after rollback.

Retain a practical number of releases. Hosting rollback creates a new release pointing to the prior version; it does not roll back SQL Connect schema/data. Frontend and database compatibility therefore require expand/migrate/contract schema discipline and backward-compatible connectors during releases.

## Domains and staging

- Use distinct hostnames such as `staging.example` and the production apex/`www` domain.
- Keep separate Firebase projects for staging and production.
- Enable automatic TLS and verify redirects/canonical URLs.
- Do not expose indexing for staging; add appropriate robots headers and restrict staff previews when necessary.
- Preview channels are temporary review artifacts, not a substitute for the stable staging environment.

## Cost readiness

Current official Hosting documentation provides no-cost quotas of 10 GB stored content and 10 GB/month data transfer, with Blaze overages. Monitor release retention, large images/downloads and transfer; set budget alerts. Hosting storage is separate from Cloud Storage for Firebase.

## Approval conditions

Hosting implementation may proceed only after staging/production project IDs, deployment identities, environment values, custom-domain ownership, cache/security headers, service-worker behavior and rollback ownership are approved. Deployment remains outside this audit.

Official references: [Hosting full configuration](https://firebase.google.com/docs/hosting/full-config), [GitHub preview integration](https://firebase.google.com/docs/hosting/github-integration), [preview/release management](https://firebase.google.com/docs/hosting/manage-hosting-resources), [cache behavior](https://firebase.google.com/docs/hosting/manage-cache), and [Hosting quotas/pricing](https://firebase.google.com/docs/hosting/usage-quotas-pricing).
