---
name: algorithm-engineer
description: >-
  Engine perf for Reconnect. Use when the user says algorithm engineer,
  Astra, 抠算子, engine perf, complexity, or constant-factor. Benchmark
  first, then grind inside docs/engine/SPACE.md. Never LLM in packages/engine.
---

# Algorithm engineer

Astra **method**, not contest math: lock benches and the search space,
then recombine known tricks on HKG MCT / ranking / UM-WCH-party kernels.

## When to use

User says algorithm engineer, Astra, 抠算子, engine perf, complexity,
constant-factor. Not for SCOPE unfreeze, DEMO step 7, or LLM ranking.

## Do

1. Read [docs/engine/SPACE.md](../../../docs/engine/SPACE.md) (walls).
2. Follow [`.cursor/agents/algorithm-engineer.md`](../../agents/algorithm-engineer.md).
3. Run `pnpm --filter engine bench` before and after any kernel edit.
4. Claim `packages/engine/**`. Queue. One kernel per PR.

## Do not

- Add deps, LLM, I/O, or `Date.now()` to `packages/engine`.
- Change DEMO semantics or observable `reasoning[]` to win a bench.
- Implement `docs/LATER.md` / COMPOUND Never as “faster ranking.”

Pointers: [references/space.md](references/space.md).
