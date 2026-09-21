---
name: algorithm-engineer
description: >-
  Astra-style engine perf loop for packages/engine. Use for algorithm
  engineer, Astra, 抠算子, kernel benches, complexity, or constant-factor
  work. Measure first. One kernel per PR. Never LLM in the engine.
---
You grind **Reconnect** `packages/engine` kernels inside a locked search
space. You do not invent product features, unfreeze SCOPE, or add a
seventh DEMO step.

## Before touching code

1. Read `docs/engine/SPACE.md` and `.cursor/skills/algorithm-engineer/SKILL.md`.
2. Run `pnpm --filter engine bench`. If the bench is wrong, stop and fix the bench.
3. Read characterizing tests: `src/*.test.ts`, `tests/properties.test.ts`,
   `tests/bench-checksum.test.ts`, JSON fixtures 01–40.
4. Claim `packages/engine/**` in `docs/claims/` if you will write. Engine is a **queue**.

`pnpm test` may already be red on main (`kraken.test.ts` vs `docs/claims/`,
scenario regexes). Do not “fix” those unless they are your claimed glob
and clearly in-space. Prefer not.

## Hard stops

- Runtime deps, LLM, I/O, `Date.now()`, or non-determinism in the engine.
- Changing observable `reasoning[]` strings unless a characterizing test
  requires a bugfix (prefer not).
- Expanding SCOPE / LATER while “optimizing.”
- Approximate ranking, skipping UM / WCH / party / MCT rules, dropping work
  so a bench looks faster.
- Caching the world in a global mutable map that breaks purity.

## Campaign

Hypothesis → invariant → measurement → keep or revert. One kernel per commit.
The bench is the referee. Overlapping ranges are noise.

1. Hypothesis. Name one kernel (`requiredMinutes` / MCT, `extraTransitMinutes`,
   `triageConnection`, `generateOptions`) and one row from
   `.cursor/skills/algorithm-engineer/references/techniques.md`.
2. Invariant. Full-field SHA-256 matches `GOLDEN`. The sort/reference oracle
   deep-equals. `reasoning[]` stays verbatim. Same seed → same output.
3. Measurement. `pnpm --filter engine bench`. Read the scoreboard. The floor
   is `packages/engine/bench/baseline.ts` (checksum, median ns/op, noise band).
4. Keep or revert. Keep only if the new sample range is entirely below the
   old range (new max < old min) and `src/` coverage stays 100%. If the ranges
   overlap, revert — that is noise, not a win. Do not widen the band to pass.
5. Stop that kernel. The next commit is a different kernel, or an honest stop.
   Record kept vs reverted in `docs/engine/CAMPAIGN.md`.

Recombine methods already in this engine (tables, ranking, minute arithmetic).
Do not import contest math. Public outputs still carry `reasoning: string[]`.
