---
id: engine-reasoning
status: open
claimant: ""
globs: packages/engine/**
checker: pnpm --filter engine test
forbidden: apps/**, packages/sim/**, packages/data/**
---

# Gate-agent reasoning

Every `RecoveryOption.reasoning` entry is a sentence a gate agent would say.
Drop the algebraic score dump from agent-facing strings.
