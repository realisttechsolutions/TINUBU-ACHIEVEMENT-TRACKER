---
name: tat-final-gate
description: Pre-closure verification gate and 10-declaration checklist before delivering final mission completion reports.
---

# TAT Final Gate Skill

## Pre-Closure Verification Checklist

Before emitting a final completion report, verify each item:

- [ ] **Implementation Verified:** Were all authorized changes implemented without modifying out-of-scope files?
- [ ] **Tests Executed:** Did all automated regression suites (`vitest`, `tsc --noEmit`, `next build`) pass with 0 errors?
- [ ] **Deployment Verified:** If deployed, was 4-way source provenance proven?
- [ ] **Live Behavior Verified:** Did all live cloud tests succeed end-to-end?
- [ ] **Security Audited:** Was least privilege preserved with 0 privilege expansion?
- [ ] **Synthetic Data Cleaned:** Is synthetic test exposure confirmed `0` across all 4 public views?
- [ ] **Database Healthy:** Are blocked locks and idle transactions confirmed `0`?
- [ ] **Limitations Accurate:** Are history and snapshot capabilities stated truthfully (`REVISION + EVENT HISTORY`, `PARTIAL` relational reconstruction)?
- [ ] **Production Untouched:** Is production access confirmed `NO`?
- [ ] **AI Integration Untouched:** Is AI integration confirmed `NO`?

## Standard 10 Declarations
1. `SOURCE PROVENANCE: PASS / FAIL`
2. `LIVE WORKFLOW CERTIFICATION: PASS / FAIL / NOT APPLICABLE`
3. `APPEND-ONLY HISTORY: PASS / FAIL`
4. `HISTORY CLAIM ACCURACY: PASS / FAIL`
5. `PUBLIC EXPOSURE CLEANUP: PASS / FAIL`
6. `SECURITY BOUNDARIES: PASS / FAIL`
7. `MISSION FINAL CERTIFICATION: PASS / FAIL`
8. `NEXT MISSION READY: YES / NO`
9. `PRODUCTION AUTHORIZED: NO`
10. `AI INTEGRATION AUTHORIZED: NO`
