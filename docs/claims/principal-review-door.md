---
id: principal-review-door
status: done
claimant: cursor/principal-review-door-9378
globs: docs/briefing/README.md, docs/apply-27-sep.md, docs/pitch/DECK.md, docs/claims/principal-review-door.md
checker: pnpm typecheck && pnpm test:demo
forbidden: packages/engine/**, .cursor/agents/algorithm-engineer.md, .cursor/skills/algorithm-engineer/**, AGENTS.md, docs/briefing/HOW_TO_WORK.md, docs/claims/algorithm-engineer.md, docs/engine/**, docs/compound/log.md, docs/SCOPE.md, docs/DEMO.md, packages/**, apps/**
---

# Principal review door

Competition front door and one speaker deck. Apply packet only.
Does not unfreeze SCOPE. Does not add a seventh demo step.
Does not touch the algorithm-engineer lease (PR #13).

`docs/compound/log.md` was not in this lease. After PR #13 merged, the
file was free of that PR (rebase had no conflict). One append-only line
was added. `reconnect-demo-polish` still marks the glob claimed; that
lease was not taken.

## Checker

Re-ran after rebase onto `origin/main` (`d0d73e1`, PR #13).

```
pnpm typecheck   # green (engine, data, sim, console)
pnpm test:demo   # 1 passed (e2e/demo.spec.ts 6-step stage demo, 8.1s)
```
