---
id: engine-fixtures-2
status: done
claimant: cursor/engine-hardening-7018
globs: packages/engine/tests/scenarios/**
checker: pnpm --filter engine test
forbidden: apps/**, packages/sim/**, packages/data/**
---

# Fixtures 11–20

## Checker

`pnpm --filter engine test` — 70 passed, 100% coverage.
