---
id: engine-reasoning
status: done
claimant: cursor/engine-hardening-7018
globs: packages/engine/**
checker: pnpm --filter engine test
forbidden: apps/**, packages/sim/**, packages/data/**
---

# Gate-agent reasoning

Every `RecoveryOption.reasoning` entry is a sentence a gate agent would say.
Drop the algebraic score dump from agent-facing strings.

## Checker

`pnpm --filter engine test` — 48 passed, 100% coverage.
