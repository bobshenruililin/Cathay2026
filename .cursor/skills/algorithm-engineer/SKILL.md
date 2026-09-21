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
2. Read [references/techniques.md](references/techniques.md) before touching a kernel.
3. Follow [`.cursor/agents/algorithm-engineer.md`](../../agents/algorithm-engineer.md).
4. Run `pnpm --filter engine bench` before and after any kernel edit.
5. Claim `packages/engine/**`. Queue. One kernel per commit.

## Campaign

Hypothesis → invariant → measurement → keep or revert.

1. Hypothesis. Name one kernel and one catalog technique.
2. Invariant. Full-field SHA-256 stays on `GOLDEN`. Sort/reference oracle deep-equals. `reasoning[]` stays verbatim.
3. Measurement. `pnpm --filter engine bench` prints a scoreboard. The committed row in `packages/engine/bench/baseline.ts` is the floor (median ns/op + noise band).
4. Keep or revert. Keep only when the new sample range sits entirely below the old one. Overlapping ranges are noise — revert. The bench fails on digest drift or a median slower than baseline + band.

One kernel per commit. Do not retune the band to manufacture a keep. Notebook: [docs/engine/CAMPAIGN.md](../../../docs/engine/CAMPAIGN.md).

## Do not

- Add deps, LLM, I/O, or `Date.now()` to `packages/engine`.
- Change DEMO semantics or observable `reasoning[]` to win a bench.
- Implement `docs/LATER.md` / COMPOUND Never as “faster ranking.”

Pointers: [references/space.md](references/space.md), [references/techniques.md](references/techniques.md).
