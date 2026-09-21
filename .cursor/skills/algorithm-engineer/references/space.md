# 抠抠空间 (engine search space)

Canonical walls: [docs/engine/SPACE.md](../../../../docs/engine/SPACE.md).

**In:** faster pure functions, fewer allocations, better loops, tighter
tables, equivalent formulas, **same** outputs and `reasoning[]`.

**Out:** LLM, new runtime deps, mutating global time, DEMO changes,
dropping reasoning, approximate ranking, skipping UM / WCH / party /
MCT, world-caches that break purity or determinism.

Kernels: `requiredMinutes` / `hkgMctMinutes`, `extraTransitMinutes`,
`triageConnection`, `generateOptions` ranking.

Benches must checksum full `reasoning[]` joins (or option flight numbers
plus scores). Faster cannot mean “did less work.” Catalog:
[techniques.md](techniques.md). Regression floor: `packages/engine/bench/baseline.ts`.
