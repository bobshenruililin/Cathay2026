---
id: engine-fast-check
status: open
claimant: ""
globs: packages/engine/**
checker: pnpm --filter engine test
forbidden: apps/**, packages/sim/**, packages/data/**
---

# fast-check 10k

DevDependency only. `isAtRisk` and `generateOptions` properties, 10_000 runs.
