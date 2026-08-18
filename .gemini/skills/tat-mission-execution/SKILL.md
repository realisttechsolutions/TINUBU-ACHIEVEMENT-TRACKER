---
name: tat-mission-execution
description: Standard operational checklist and execution discipline for TAT engineering missions. Enforces inspect -> plan -> minimal implementation -> verify -> report.
---

# TAT Mission Execution Skill

## Operational Workflow Checklist

### Phase 1: Understand & Decompose
- [ ] Read the full mission specification.
- [ ] Identify Objective, Authorized Scope, and Prohibited Scope.
- [ ] Identify Stop Conditions and Dangerous Operations.
- [ ] Confirm the certified baseline SHA.

### Phase 2: Inspect Before Modifying
- [ ] Verify clean working tree (`git status`).
- [ ] Verify branch and HEAD commit (`git rev-parse HEAD`).
- [ ] Inspect relevant local source files without modifying them.
- [ ] Check relevant schema and database configurations.

### Phase 3: Minimal Diff Implementation
- [ ] Plan the minimal possible diff to achieve the objective.
- [ ] Implement changes cleanly.
- [ ] Do NOT perform unrelated refactoring, lint fixes, or dependency upgrades.

### Phase 4: Automated Verification
- [ ] Run domain unit tests (`vitest run <test_file>`).
- [ ] Run full test suite (`vitest run`).
- [ ] Run TypeScript typecheck (`tsc --noEmit`).
- [ ] Run production build (`next build`) if frontend or route changes were made.
- [ ] Check whitespace and formatting (`git diff --check`).

### Phase 5: Commit & Push Gate
- [ ] Stage only authorized files (`git add <files>`).
- [ ] Commit locally with descriptive conventional commit message.
- [ ] **STOP for Operator Push** (Never push automatically).
- [ ] Verify remote SHA matches local SHA after operator push confirmation.
