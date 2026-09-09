---
id: engine-fixtures-4
status: done
claimant: cursor/engine-hardening-7018
globs: packages/engine/tests/scenarios/**
checker: pnpm --filter engine test
forbidden: apps/**, packages/sim/**, packages/data/**
---

# Fixtures 31–40+

## Checker

`pnpm --filter engine test` — 90 passed, 40 JSON fixtures, 100% coverage.
