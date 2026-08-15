# Tinubu Achievement Tracker — Frontend V2 Design System Specification

**Design System Version:** 2.0.0 (2026 Public Intelligence Edition)  
**Effective Date:** 2026-08-15  
**Governing Contract:** `docs/research/TAT_RESEARCH_CONTRACT_V1_1_2.md`  

---

## 1. Core Visual Philosophy

The Frontend V2 Design System balances **institutional credibility**, **modern 2026 digital product design**, and **Nigerian national identity**. The visual experience avoids tacky political banners or noisy game-like graphics in favor of:
- **Clean editorial clarity** with crisp hierarchy and generous whitespace.
- **Layered spatial depth** utilizing subtle glass surfaces, soft ambient lighting, and refined border rings.
- **Evidentiary transparency** using unambiguous visual tokens for implementation stages, source reliability, and data certainty.
- **Mobile-first accessibility** ensuring seamless touch usability on standard Nigerian mobile networks and screens.

---

## 2. Color Palette & Semantic Tokens

```text
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    CORE BRAND PALETTE TOKENS                                      |
+──────────────────────────┬──────────────────────────┬─────────────────────────────────────────────+
| Token Name               | Hex / HSL Value          | Semantic Application                        |
+──────────────────────────┼──────────────────────────┼─────────────────────────────────────────────+
| Presidential Navy        | #081B2E (210, 70%, 11%)  | Primary brand anchor, dark headers, text    |
| Nigeria Emerald          | #006B3F (155, 100%, 21%) | Positive progress, primary actions, accents |
| Refined Gold             | #C5A059 (41, 49%, 56%)   | Milestones, key metrics, highlights, rings  |
| Warm Canvas              | #F7F8F4 (80, 15%, 96%)   | Soft background surfaces, card fills        |
| Pure Surface             | #FFFFFF (0, 0%, 100%)    | Foreground card surfaces, dialogs, modals   |
| Deep Text                | #101828 (215, 50%, 11%)  | Primary high-contrast body text             |
| Secondary Slate          | #5E6B78 (212, 12%, 42%)  | Subtitles, metadata labels, borders         |
| Soft Border              | #D8DEE6 (215, 20%, 88%)  | Structural dividers, card strokes           |
| Dark Surface (Dark Mode) | #071522 (210, 55%, 8%)   | Dark theme canvas, deep background panels   |
+──────────────────────────┴──────────────────────────┴─────────────────────────────────────────────+
```

### 2.1 Implementation Status Semantic Mapping (21 Stages)

```text
[PROPOSED / ANNOUNCED]       -> Neutral Slate / Blue (bg-blue-50 text-blue-700 border-blue-200)
[APPROVED / ENACTED]         -> Royal Blue (bg-indigo-50 text-indigo-700 border-indigo-200)
[FUNDED / FUNDING_RELEASED]  -> Teal / Emerald (bg-emerald-50 text-emerald-800 border-emerald-200)
[PROCUREMENT / PLANNING]     -> Amber (bg-amber-50 text-amber-800 border-amber-200)
[IMPLEMENTATION_ONGOING]     -> Deep Amber / Orange (bg-orange-50 text-orange-800 border-orange-200)
[PARTIALLY_DELIVERED]        -> Lime / Green (bg-lime-50 text-lime-800 border-lime-200)
[COMPLETED / OPERATIONAL]    -> Nigeria Emerald (bg-emerald-100 text-emerald-900 border-emerald-300 font-bold)
[OUTCOME_REPORTED]           -> Gold / Emerald (bg-amber-100 text-amber-900 border-amber-300)
[INDEPENDENTLY_ASSESSED]     -> Purple / Gold (bg-purple-50 text-purple-800 border-purple-200)
[SUSPENDED / REPEALED]       -> Rose / Red (bg-red-50 text-red-700 border-red-200)
[UNDER_REVIEW / ARCHIVED]    -> Slate (bg-gray-100 text-gray-700 border-gray-300)
```

### 2.2 Source Hierarchy Reliability Indicators (6 Levels)
- **Level 1 (Statutory & Gazette):** Dark Navy Badge + Gold Shield (`bg-gov-navy text-gov-gold`)
- **Level 2 (Official Statistics - NBS/CBN):** Emerald Badge (`bg-emerald-700 text-white`)
- **Level 3 (Multilateral / Audited):** Purple Badge (`bg-purple-700 text-white`)
- **Level 4 (Credible Media):** Blue Badge (`bg-blue-700 text-white`)
- **Level 5 (Official Statements / Press):** Slate Badge (`bg-slate-700 text-white`)
- **Level 6 (Discovery Leads):** Warning Amber Outline (`border-dashed border-amber-500 text-amber-700`) — *Internal only, marked clearly as lead*.

---

## 3. Typography & Numerical Formatting

- **Display Font:** `Montserrat` (Weights: 600, 700, 800) for headlines, hero titles, and major statistics.
- **Body Font:** `Inter` (Weights: 400, 500, 600) for body copy, table text, metadata, and UI labels.
- **Tabular Figures:** `font-variant-numeric: tabular-nums` enforced on all numbers, currency figures, and dates to ensure clean vertical column alignment.
- **Headline Scales:**
  - `Display 1 (Hero):` `text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight`
  - `H1 (Page Title):` `text-2xl sm:text-3xl lg:text-4xl font-bold`
  - `H2 (Section Header):` `text-xl sm:text-2xl font-bold`
  - `H3 (Card Title):` `text-base sm:text-lg font-semibold`
  - `Body / Summary:` `text-sm sm:text-base leading-relaxed`
  - `Caption / Badge:` `text-xs font-medium tracking-wide`

---

## 4. Spacing, Radii, Shadows & Glass Surfaces

- **Grid Container Widths:**
  - Max Width: `1440px` (`max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8`)
  - Detail Reader Max Width: `896px` (`max-w-4xl`)
- **Border Radii:**
  - Small pills/badges: `rounded-full`
  - Form controls / buttons: `rounded-md` (`6px`) or `rounded-lg` (`8px`)
  - Standard cards: `rounded-xl` (`12px`)
  - Hero containers & modals: `rounded-2xl` (`16px`)
- **Shadow Hierarchy:**
  - Card Default: `shadow-sm hover:shadow-md transition-shadow`
  - Dropdowns & Popovers: `shadow-lg border border-gov-border/80`
  - Modals & Drawers: `shadow-2xl`
- **Glass Surfaces:**
  - `backdrop-blur-md bg-white/90 dark:bg-gov-darkSurface/90 border border-gov-border/80`

---

## 5. Mobile-First Interaction & Responsive Rules

1. **Touch Target Size:** Minimum `44x44px` interactive area for all buttons, filter chips, tabs, and navigation links.
2. **Mobile Drawers (`vaul` / Radix Sheet):** Complex filters on mobile collapse into a bottom sheet drawer with an instant "Apply Filters (X Results)" sticky button.
3. **Data Display Switching:** Wide multi-column tables automatically transform to structured, stacked cards on screens narrower than `768px`.
4. **Map Interactions:** On mobile screens, the vector map features touch-friendly pinch/tap gestures and an immediate accessible "View as List" toggle.

---

## 6. Motion & Animation Guidelines

- **Duration Scales:** `150ms` (hover/micro-interactions), `300ms` (dropdowns/drawers), `500ms` (page elements).
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like ease-out for natural deceleration).
- **Reduced Motion Support:** All transitions and keyframe animations respect `@media (prefers-reduced-motion: reduce)`.
- **Prohibited Effects:** Continuous floating particles, heavy WebGL loops, distracting pulsing glows.
