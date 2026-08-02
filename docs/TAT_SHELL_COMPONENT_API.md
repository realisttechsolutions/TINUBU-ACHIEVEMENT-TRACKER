# Shell Component API Documentation — Tinubu Achievement Tracker V2

This document provides typed API specifications and usage instructions for the core global application shell components created during **Mission 02**.

---

## 1. `AppShell`
Master application shell wrapper uniting skip navigation, header, main content landmark, and global footer.

```tsx
import React from 'react';
import AppShell from '@/components/layout/AppShell';

export const App = () => (
  <AppShell>
    {/* Page Routes */}
  </AppShell>
);
```

---

## 2. `BrandLockup`
Responsive brand logo lockup supporting emblem-only mode, full wordmark mode, and accessible text alternatives.

```tsx
interface BrandLockupProps {
  compact?: boolean;    // If true, renders emblem and concise title without subtitle
  className?: string;  // Additional utility classes
  onClick?: () => void; // Optional click handler (e.g. for closing mobile drawer)
}
```

---

## 3. `DesktopNavigation`
Grouped dropdown navigation component (*Overview*, *Sectors*, *Evidence*) driven by `navigation.config.ts`. Supports keyboard navigation, `Esc` closing, and `aria-current="page"`.

---

## 4. `MobileNavigationDrawer`
Full-height slide-out drawer for tablet & mobile viewports.

```tsx
interface MobileNavigationDrawerProps {
  isOpen: boolean;    // Controls drawer visibility
  onClose: () => void; // Function to close drawer
}
```

---

## 5. `GlobalSearch`
Accessible dialog search overlay with `Ctrl + K` / `Cmd + K` shortcut and route search indexing.

```tsx
interface GlobalSearchProps {
  isOpen: boolean;    // Controls dialog visibility
  onClose: () => void; // Function to close search dialog
}
```

---

## 6. `HeaderActions`
Utility bar containing search trigger, desktop language selector, theme toggle, and reports action button.

```tsx
interface HeaderActionsProps {
  onOpenSearch: () => void; // Trigger function to launch GlobalSearch modal
}
```

---

## 7. `StatusBadge`, `DataClassificationBadge`, `SourceBadge`
Semantic badges for rendering evidence metrics across cards.

```tsx
<StatusBadge status="Completed" size="sm" />
<DataClassificationBadge classification="Actual" size="sm" />
<SourceBadge sourceName="National Bureau of Statistics" level={2} sourceUrl="https://nigerianstat.gov.ng" verificationDate="Apr 2025" />
```
