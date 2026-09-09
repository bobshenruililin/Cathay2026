---
id: engine-fixtures-1
status: done
claimant: cursor/engine-hardening-7018
globs: packages/engine/tests/scenarios/**
checker: pnpm --filter engine test
forbidden: apps/**, packages/sim/**, packages/data/**
---

# Fixtures 01–10

Named stories: inbound delay, tight, no seats, partner-only, overnight, party of 4,
wheelchair, UMNR.

## Checker

`pnpm --filter engine test` — 60 passed, 100% coverage.
