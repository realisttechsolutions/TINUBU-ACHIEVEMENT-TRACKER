# Duplicate Detection Standard — Tinubu Achievement Tracker V2

This document defines duplicate matching signals and resolution protocols.

---

## 1. Matching Signals
- Exact canonical slug match.
- Title string similarity > 85%.
- Matching contract ID or Gazette reference.
- Identical lead agency + identical state location.

---

## 2. Resolution Actions
- **Merge**: Merge record entries and map alternate titles to `aliases`.
- **Separate**: Maintain distinct entries if projects refer to separate phases.
- **Alias Only**: Store alternate naming convention in `institution_aliases` or `geographic_aliases`.
