# Tinubu Achievement Tracker — Frontend V2 Accessibility & Performance Specification

**Standard Version:** 2.0.0  
**Effective Date:** 2026-08-15  
**Governing Standard:** WCAG 2.2 Level AA / Mobile-First Optimization  

---

## 1. Accessibility Conformance (WCAG 2.2 AA)

1. **Color Contrast:** All body text maintains minimum **4.5:1** contrast ratio against backgrounds; large headlines and UI buttons maintain minimum **3.0:1** contrast ratio.
2. **Keyboard Navigation:** Every interactive element (menus, search palette, filter chips, map states, accordion toggles, download buttons) is fully navigable via `Tab`, `Arrow keys`, `Enter`, and `Escape`.
3. **Focus States:** High-visibility focus indicators (`ring-2 ring-gov-navy dark:ring-gov-gold ring-offset-2`) are enforced across all interactive controls.
4. **ARIA Landmarks & Labels:**
   - `<header role="banner">`, `<main id="main-content" role="main">`, `<nav aria-label="...">`, `<footer role="contentinfo">`.
   - Modals and drawers use `aria-modal="true"`, `aria-labelledby`, and trap keyboard focus when open.
   - Screen reader descriptions (`sr-only`) provided for icon-only buttons and complex SVG map paths.
5. **Reduced Motion:** All transitions automatically disable or collapse to instant cuts when `@media (prefers-reduced-motion: reduce)` is enabled.

---

## 2. Performance Engineering for Nigerian Networks

```text
+──────────────────────────────────┬──────────────────────────────┬─────────────────────────────────────+
| Performance Dimension           | Target Budget                | Engineering Optimization Strategy   |
+──────────────────────────────────┼──────────────────────────────┼─────────────────────────────────────+
| First Contentful Paint (FCP)     | < 1.2 seconds                | Critical CSS inline, fonts preloaded|
| Largest Contentful Paint (LCP)   | < 2.4 seconds                | WebP/SVG vector imagery, lazy charts|
| Total Blocking Time (TBT)        | < 150 ms                     | Code splitting by page route        |
| Cumulative Layout Shift (CLS)    | < 0.05                       | Explicit width/height placeholders  |
| Main Bundle JavaScript Size      | Optimized chunking           | Dynamic import() for heavy charts   |
+──────────────────────────────────┴──────────────────────────────┴─────────────────────────────────────+
```

### 2.1 Route Code-Splitting Strategy
Every top-level page (`Index`, `AchievementsCatalogue`, `AchievementDetail`, `SectorsCatalogue`, `SectorDetail`, `ProjectsCatalogue`, `PoliciesCatalogue`, `ProgrammesCatalogue`, `TimelinePage`, `ImpactMapPage`, `StateDetail`, `DataExplorer`, `Downloads`, `DataSources`, `Dashboard`) is dynamically loaded via `React.lazy()` with graceful `<SuspenseFallback />` spinners.
