---
id: engine-ssr-party
status: done
claimant: cursor/engine-hardening-7018
globs: packages/engine/**
checker: pnpm --filter engine test
forbidden: apps/**, packages/sim/**, packages/data/**
---

# Additive SSR / party fields

Keep exported function signatures. Add `ssr?` and `partyId?`. Wheelchair SSR and
UMNR map onto existing buffers. UM drops overnight candidates. Party of 4 stays
on one flight.

## Checker

`pnpm --filter engine test` — 47 passed, 100% statements/branches/functions/lines.
