---
id: algorithm-engineer
status: claimed
claimant: cursor/algorithm-engineer-a7f8
globs: packages/engine/**, docs/claims/algorithm-engineer.md, docs/engine/**, .cursor/agents/algorithm-engineer.md, .cursor/skills/algorithm-engineer/**, AGENTS.md, docs/briefing/HOW_TO_WORK.md
checker: pnpm --filter engine typecheck && pnpm --filter engine test && pnpm --filter engine bench
forbidden: apps/**, e2e/**, docs/SCOPE.md, docs/DEMO.md, packages/sim/**, packages/data/**
---

# Algorithm engineer (Astra-style)

Engine tooling + Cursor agent/skill. Benches, search-space walls, one
in-space kernel grind. Not a SCOPE unfreeze. Not a seventh DEMO step.
Not LLM in the engine.

Engine claims are a queue. Pre-existing `pnpm test` reds on main
(`kraken.test.ts` vs `docs/claims/`, scenario regexes) stay untouched.

`docs/compound/log.md` is leased by `reconnect-demo-polish`; this PR
appends one `astra-bench-space` line (append-only compound contract).
