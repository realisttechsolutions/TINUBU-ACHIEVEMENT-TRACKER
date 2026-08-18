# ============================================================
# PTAT FRONTEND DESIGN SYSTEM SPECIFICATION
# CANONICAL BRAND, TOKENS, CTA & MOTION STANDARDS (2026)
# ============================================================

**Product:** President Tinubu Achievement Tracker (PTAT)  
**Authority:** Command Centre  
**Established In:** Mission M10J-B & M10J-C  
**Status:** Certified Canonical Foundation  

---

## 1. Product Identity & Brand Nomenclature

- **Official Full Name:** President Tinubu Achievement Tracker
- **Canonical Acronym:** PTAT
- **Display Standard:** `PTAT` / `President Tinubu Achievement Tracker`
- **Mandate Window:** 29 May 2023 — August 2026 (Renewed Hope Agenda)
- **Visual Direction:** Institutional, sovereign, evidence-driven, dignified modern federal intelligence hub.

---

## 2. Color Palette & Semantic Tokens

### 2.1 Core Sovereign Palette

| Token Name | Tailwind Class | Hex Value | HSL Value | Semantic Role |
| :--- | :--- | :--- | :--- | :--- |
| **Presidential Navy** | `bg-gov-navy`, `text-gov-navy` | `#081B2E` | `hsl(210 70% 11%)` | Primary structural background, dark text, headers |
| **Nigeria Emerald** | `bg-gov-emerald`, `text-gov-emerald` | `#006B3F` | `hsl(155 100% 21%)` | Primary action CTA, verified success, national brand |
| **Refined Gold** | `bg-gov-gold`, `text-gov-gold` | `#C5A059` | `hsl(41 49% 56%)` | Accents, badges, active tabs, milestone highlights |
| **Warm Canvas** | `bg-gov-canvas` | `#F7F8F4` | `hsl(80 15% 96%)` | Light background surface, card backing |
| **Pure Surface** | `bg-white` | `#FFFFFF` | `hsl(0 0% 100%)` | Light mode card and panel surface |
| **Dark Surface** | `bg-gov-darkSurface` | `#071522` | `hsl(210 55% 8%)` | Dark mode cards, modals, hero panels |
| **Secondary Slate** | `text-gov-slate` | `#5E6B78` | `hsl(212 12% 42%)` | Subtitles, helper text, secondary labels |
| **Soft Border** | `border-gov-border` | `#D8DEE6` | `hsl(215 20% 88%)` | Dividers, card borders, subtle grid lines |

### 2.2 Semantic Status Tokens

- **`status.green` (`#006B3F`):** Verified positive progress, completed, operational
- **`status.blue` (`#0284C7`):** Provisional, institutional report, in execution
- **`status.gold` (`#C5A059`):** Statute in force, target achieved, milestone
- **`status.amber` (`#D97706`):** Partial delivery, pending verification
- **`status.red` (`#DC2626`):** Correction required, decline, risk
- **`status.slate` (`#5E6B78`):** Neutral, archived, N/A

---

## 3. Typography Hierarchy

| Element | Font Family | Weight | Tracking | Responsive Size Clamp |
| :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | `Montserrat` (Display) | 900 (Black) | `tracking-tight` | `text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl` |
| **Section H2** | `Montserrat` (Display) | 800 (Extrabold) | `tracking-tight` | `text-xl sm:text-2xl md:text-3xl lg:text-4xl` |
| **Card H3 / H4** | `Montserrat` (Display) | 700 (Bold) | `tracking-tight` | `text-sm sm:text-base md:text-lg` |
| **Body Text** | `Inter` (Sans) | 400 (Regular) / 500 (Medium) | `normal` | `text-xs sm:text-sm md:text-base` |
| **Badges / Tags** | `Inter` (Sans) | 700 (Bold) | `uppercase tracking-wider` | `text-[10px] sm:text-xs` |
| **Metrics / Data** | `Montserrat` (Display) | 900 (Black) | `tabular-nums` | `text-lg sm:text-2xl md:text-3xl` |

---

## 4. Call-to-Action (CTA) Hierarchy

1. **Primary CTA (Solid Green):**
   - Classes: `bg-gov-emerald hover:bg-emerald-800 text-white font-bold text-sm px-7 py-3 h-12 shadow-lg rounded-xl gold-ring-focus`
   - Purpose: Primary exploration path (e.g. `Explore Achievements`).
2. **Secondary CTA (Refined Glass):**
   - Classes: `bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm px-6 py-3 h-12 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-gov-gold`
   - Purpose: Key secondary vector action (e.g. `Nigeria Impact Map`).
   - Standard: Visible `#FFFFFF` text on translucent background, `#C5A059` gold icon.
3. **Tertiary / Utility CTA (Ghost / Plain):**
   - Classes: `text-gray-300 hover:text-white hover:bg-white/10 text-sm font-semibold h-12 rounded-xl`
   - Purpose: Direct data exploration (e.g. `Data Explorer`).

---

## 5. Motion Design System & Timing Tokens

All motion is standardized in `src/lib/animations.ts` via GSAP and Tailwind CSS.

### 5.1 Canonical Motion Tokens

```typescript
export const MOTION_TOKENS = {
  FAST: 0.2,        // 200ms: micro-interactions, icon hover, badge pulses
  STANDARD: 0.35,   // 350ms: card transitions, tab switches, spotlight slides
  SLOW: 0.6,        // 600ms: section scroll entrances, modal reveals
  ROTATION_INTERVAL: 6000, // 6s: intelligence line and spotlight auto-rotation
};
```

### 5.2 Motion Rules & Safeguards

1. **No Frame-Rate React Rerenders:** DOM transforms and opacity transitions run via GSAP hardware-accelerated transforms (`x`, `y`, `opacity`, `scale`).
2. **No Layout Shift:** Rotating text and spotlight cards reside in fixed/constrained height containers (`min-h-[170px]`).
3. **Pause on Hover / Focus:** Auto-rotation timers pause when mouse enters the hero or spotlight, when a control receives keyboard focus, or when the browser tab is hidden (`visibilitychange`).
4. **Accessibility on Auto-Rotation (`aria-live="off"`):** Automatic supporting statement rotation must use `aria-live="off"` to prevent periodic screen-reader spam every 6 seconds, while remaining fully accessible in the static DOM.
5. **Reduced Motion:** If `window.matchMedia('(prefers-reduced-motion: reduce)')` is true, GSAP animations and translations are bypassed for immediate state presentation.


---

## 6. Certified Responsive Viewport Matrix

| Viewport Category | Resolution | Target Verification Requirement |
| :--- | :--- | :--- |
| **Mobile Small** | `360 × 800` | Compact 3-column metric row, single-column hero, zero horizontal overflow |
| **Mobile Standard** | `390 × 844` | Fluid typography, tap targets $\ge 44\text{px}$, drawer navigation |
| **Mobile Large** | `430 × 932` | Full readability, tight vertical footprint |
| **Tablet Portrait** | `768 × 1024` | 2-column grid transitions, visible search |
| **Tablet Landscape** | `1024 × 768` | Clean hamburger drawer trigger (`xl:hidden`), no header collision |
| **Desktop Standard** | `1280 × 800` | Full 6-item desktop navigation, non-truncated PTAT brand lockup |
| **Desktop Large** | `1440 × 900` | 1440px max-width container, full visual spatial lighting |
| **Desktop Widescreen** | `1728 × 900` | Centered layout, no stretched containers |

---

*Certified Canonical Design System Document. Ready for future mission reference.*
