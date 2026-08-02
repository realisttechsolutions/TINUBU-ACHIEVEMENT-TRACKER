# Contradiction Protocol & Severity Matrix — Tinubu Achievement Tracker V2

This document defines the rules for logging, preserving, and resolving conflicting evidence.

---

## 1. Contradiction Severity Matrix

| Severity | Definition | Resolution Rule |
| :--- | :--- | :--- |
| **Minor** | Typographical date variance or rounding difference (e.g. 47km vs 47.2km). | Document in `internal_notes`; publish rounded canonical figure. |
| **Material** | Significant metric variance (e.g. 25,000 vs 30,000 beneficiaries) or status disagreement. | Preserve both in internal log; publish conservative figure with explicit qualification note. |
| **Critical** | Fundamental contradiction on delivery status, legal validity, or funding release. | Revert record status to `under_review`; block public display until senior editor audit. |

---

## 2. Mandatory Preservation Rule
Researchers MUST NOT silently delete a competing figure or choose the highest number. Both figures must be logged in `contradiction_log.csv`.
