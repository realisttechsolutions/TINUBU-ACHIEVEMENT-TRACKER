# TAT M09 Accessibility (A11y) Regression Audit
## WCAG 2.1 AA Compliance Verification across Next.js Components

**Status:** PASSED (WCAG 2.1 Level AA Compliant)  

---

## 1. Accessibility Checks

1. **Skip Navigation Links:** Implemented in `src/views/*` for screen-reader users.
2. **Landmark Structure:** Single `<h1>` per page, semantic `<header role="banner">`, `<main role="main">`, `<footer role="contentinfo">`.
3. **Color Contrast:** All text elements meet or exceed the minimum 4.5:1 contrast ratio against both light (`#F8FAFC`) and dark (`#0A192F`) backgrounds.
4. **Keyboard Navigation:** Focus rings (`focus-visible:ring-2 focus-visible:ring-ring`) preserved on all buttons, links, inputs, and tabs.
5. **Screen Reader Attributes:** `aria-label`, `aria-expanded`, `aria-controls`, and `aria-hidden` attributes configured on dynamic menus, drawers, and modal dialogs.