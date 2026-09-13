---
id: hackathon-skill
status: done
claimant: cursor/hackathon-skill-316e
globs: .cursor/skills/hackathon/**, .cursor/rules/hackathon.mdc, AGENTS.md, docs/HACKATHON.md, docs/SCOPE.md, docs/QUESTIONS.md, docs/claims/hackathon-skill.md
checker: test -f .cursor/skills/hackathon/SKILL.md && test -f docs/HACKATHON.md && pnpm typecheck && pnpm test:demo
forbidden: packages/**, apps/**, docs/DEMO.md, e2e/**
---

# Cathay-tuned `/hackathon` skill

Lease for the freeze/apply skill. Not a product feature. Not a builder swarm.

## Checker

```
test -f .cursor/skills/hackathon/SKILL.md && test -f docs/HACKATHON.md
pnpm typecheck   # green (engine, data, sim, console)
pnpm test:demo   # 1 passed (e2e/demo.spec.ts 6-step stage demo, 8.3s)
```

`pnpm test` was also run. `packages/engine` is red on `origin/main` already
(5 tests: `kraken.test.ts` wants `docs/claims` absent; four
`tests/scenarios.test.ts` regexes vs current `option-reason` prefixes).
This claim forbids `packages/**`. Diff vs main does not touch engine, DEMO,
or e2e. data/sim/console tests: 51 passed.
