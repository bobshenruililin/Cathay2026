# Engine search space

Walls for Astra-style grinds in `packages/engine`. Method, not a new
product: **benchmark first**, then stay inside this convex hull.

Demo path (`docs/DEMO.md`, six steps) stays sacred. Same seed → same
output. `reasoning[]` is observable.

## In (legal)

- Faster pure functions; fewer allocations; tighter loops.
- Tighter tables (HKG MCT family pairs stay the single source of truth).
- Equivalent formulas (same numbers, same ranking, same strings).
- Linear pick instead of sort when only the winner is used.
- Score/rank without building `reasoning[]`, then build strings for the
  0–3 chosen options.
- Interval arithmetic on minutes (`minutesBetween`, MCT + buffers).

## Out (illegal)

- LLM calls or imports anywhere under `packages/engine`.
- New runtime `dependencies` (keep `{}`).
- I/O, `Date.now()`, or other non-determinism.
- Changing DEMO semantics or adding a seventh demo step.
- Dropping or rewriting `reasoning[]` to look faster.
- Approximate ranking or skipping UM / wheelchair / unsplittable party /
  SSR / downgrade-protection rules.
- “Just cache the world” in a mutable global that breaks purity.
- Inventing algorithms from outside this hull (contest DP, solvers,
  Painlevé, Gurobi). Recombine what is already here.

## Kernels

| Kernel | What it is |
| --- | --- |
| `requiredMinutes` / `hkgMctMinutes` | MCT table + gate-walk |
| `extraTransitMinutes` | UM escort + WCH gate buffers (flags and SSR do not stack) |
| `triageConnection` | Slack vs required; `atRisk`; notes |
| `generateOptions` | Viable pool → ≤3 ranked options + reasoning |

## Benches

`pnpm --filter engine bench` — ring of seeds × recipes, **fresh
object identities** every call, SHA-256 of full observed Flight /
TriageResult / RecoveryOption fields (exact `reasoning[]`). Deep-equal
the sort reference **outside** timed work. Harness prints **median +
min/max** over multiple samples, then a scoreboard against
`packages/engine/bench/baseline.ts` (checksum, median ns/op, noise band).
The run fails if a digest drifts or a kernel median is slower than
baseline + band. A faster median is not a keep until the sample ranges
are disjoint; overlapping ranges are noise. Notebook:
`docs/engine/CAMPAIGN.md`. `tests/bench-checksum.test.ts` and
`tests/rank-oracle.test.ts` lock the digest and the sort oracle on
`pnpm --filter engine test`.

`pnpm test` may already be red on `origin/main`: `kraken.test.ts`
asserts `docs/claims/` is absent; four scenario regexes disagree with
`option-reason` prefixes. Do not “fix” those from a perf grind.

## Stop

Coverage < 100%, checksum drift, test fail, or speedup inside noise →
revert. One kernel per PR.
