---
id: engine-assertion-align
status: done
claimant: cursor/align-stale-engine-assertions-3dd5
globs: packages/engine/src/kraken.test.ts, packages/engine/tests/scenarios.test.ts, docs/claims/engine-assertion-align.md, docs/compound/log.md
checker: pnpm typecheck && pnpm test && pnpm test:demo
forbidden: packages/engine/src/feasibility.ts, packages/engine/src/index.ts, packages/engine/src/iso.ts, packages/engine/src/mct.ts, packages/engine/src/option-reason.ts, packages/engine/src/options.ts, packages/engine/src/passenger.ts, packages/engine/src/score.ts, packages/engine/src/seating.ts, packages/engine/src/triage.ts, packages/engine/src/types.ts, packages/engine/src/fixtures.ts, docs/SCOPE.md, docs/DEMO.md, docs/claims/algorithm-engineer.md, docs/claims/reconnect-demo-polish.md
---

# Stale assertion alignment

`pnpm test` reds after #13 are assertion copy, not engine decisions.
Update only `kraken.test.ts` and `scenarios.test.ts` so they lock the
current sentences and the markdown claims lease in AGENTS.md.

`algorithm-engineer` stays `claimed` and is not edited. PR #13 is already
on main. This lease is the writer for the two test files.

`reconnect-demo-polish` still lists `docs/compound/log.md`. One append-only
line. That claim file is not edited.

## Checker

`pnpm typecheck && pnpm test && pnpm test:demo` on `7af5d51`.

- typecheck: engine, data, sim, console done.
- `pnpm test`: engine 101 passed, src/ coverage 100/100/100/100; data 6 passed; sim 8 passed; console 41 passed.
- `pnpm test:demo`: 1 passed.
