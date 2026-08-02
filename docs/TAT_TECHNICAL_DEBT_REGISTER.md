# Technical Debt Register — Tinubu Achievement Tracker V2

This document records resolved technical debt items and tracks remaining architectural, responsive, accessibility, or translation gaps.

---

## ✅ Resolved Technical Debt (Missions 01 & 02)

| ID | Category | Item Description | Status | Resolution / Component |
| :--- | :--- | :--- | :--- | :--- |
| **TD-01** | Branding | Inconsistent logo naming ("TPW", "RHT", "Renewed Hope Tracker") causing wordmark wrapping on mobile | **RESOLVED** | Unified to `BrandLockup.tsx` ("Tinubu Achievement Tracker" / `TAT` emblem) |
| **TD-02** | Design Tokens | Unrestricted purple gradients (`#7E69AB`) and bright blue (`#2E3192`) violating Presidential tone | **RESOLVED** | Mapped design tokens in `tailwind.config.ts` (`gov-navy`, `gov-emerald`, `gov-gold`, `gov-canvas`) |
| **TD-03** | Layout / UI | Floating language switcher pill in bottom-left corner overlapping main page content | **RESOLVED** | Removed floating pill; embedded `LanguageSelector` into `HeaderActions` and `MobileNavigationDrawer` |
| **TD-04** | Header | Non-functional notification bell icon and standalone global share button creating visual clutter | **RESOLVED** | Removed from `GlobalHeader.tsx`; header focused on core search, language, theme, & reports action |
| **TD-05** | Accessibility | Missing skip navigation link for keyboard users to bypass header | **RESOLVED** | Created `SkipNavigation.tsx` targeting `<main id="main-content">` |
| **TD-06** | Navigation | Unstructured top-level navigation links overflowing on tablet landscape (1024px–1279px) | **RESOLVED** | Created `DesktopNavigation.tsx` with grouped dropdowns (*Overview*, *Sectors*, *Evidence*) |
| **TD-07** | RTL | Missing text direction support for Arabic (`ar`) language | **RESOLVED** | `LanguageContext.tsx` automatically sets `document.documentElement.dir = 'rtl'` for Arabic |
| **TD-08** | Achievements | Disconnected achievement cards lacking searchable database or individual detail pages | **RESOLVED** | Created `/achievements` catalogue (`AchievementsCatalogue.tsx`) and `/achievements/:slug` detail pages (`AchievementDetail.tsx`) |

---

## 📌 Deferred / Remaining Technical Debt (For Future Missions)

| ID | Category | Item Description | Mission Target |
| :--- | :--- | :--- | :--- |
| **TD-08** | Page Content | Individual sector pages (`EconomicReforms`, `SecurityProgress`, `Infrastructure`, `SocialServices`) contain page-level `<Navbar />` or redundant container margins | **Mission 03** (Homepage & Sector Transformation) |
| **TD-09** | Translations | Some deep data labels in Hausa (`ha`), Igbo (`ig`), and Yoruba (`yo`) fallback to English defaults | **Mission 05** (Content & Localization Polish) |
| **TD-10** | Dynamic CMS | Application data is statically compiled inside `src/data/*.ts` without dynamic backend endpoint | **Mission 06** (Data & CMS Integration) |
