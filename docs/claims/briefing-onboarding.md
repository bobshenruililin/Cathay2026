---
id: briefing-onboarding
status: done
claimant: cursor/briefing-onboarding-a7f8
globs: docs/briefing/**, docs/claims/briefing-onboarding.md, README.md, AGENTS.md
checker: test -f docs/briefing/README.md && test -f docs/briefing/TEAM.md && test -f docs/briefing/HOW_TO_WORK.md && test -f docs/briefing/WINNING.md && pnpm typecheck && pnpm test:demo
forbidden: packages/**, apps/**, docs/SCOPE.md, docs/DEMO.md, e2e/**
---

# Teammate briefing (orientation)

Human/agent onboarding markdown in `docs/briefing/`. Not a product feature.
Does not unfreeze SCOPE. Does not change the six-step demo.

Existing `docs/briefing/index.html` competitive-intel explorer stays; README
becomes the front door and still links to it.

## Checker

```
pnpm typecheck   # green (engine, data, sim, console)
pnpm test:demo   # 1 passed (e2e/demo.spec.ts 6-step stage demo, 9.2s)
```

`pnpm test` remains red on `origin/main` in `packages/engine` (5 tests:
`kraken.test.ts` wants `docs/claims` absent; four `tests/scenarios.test.ts`
regexes vs current `option-reason` prefixes). This claim forbids
`packages/**`. Diff does not touch engine, DEMO, or e2e.
