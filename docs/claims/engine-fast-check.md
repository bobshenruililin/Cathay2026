---
id: engine-fast-check
status: done
claimant: cursor/engine-hardening-7018
globs: packages/engine/**
checker: pnpm --filter engine test
forbidden: apps/**, packages/sim/**, packages/data/**
---

# fast-check 10k

DevDependency only. `isAtRisk` and `generateOptions` properties, 10_000 runs.

## Checker

`pnpm --filter engine test` — 49 passed (2 properties × 10k), 100% coverage.
