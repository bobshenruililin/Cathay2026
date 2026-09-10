---
id: engine-fixtures-3
status: done
claimant: cursor/engine-hardening-7018
globs: packages/engine/tests/scenarios/**
checker: pnpm --filter engine test
forbidden: apps/**, packages/sim/**, packages/data/**
---

# Fixtures 21–30

## Checker

`pnpm --filter engine test` — 80 passed, 100% coverage.
