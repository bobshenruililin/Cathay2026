# How to work

For humans **and** Cursor / Claude Cowork agents. How this repo works, and
how not to break it.

**Agents:** this file is orientation. On conflict:
[`AGENTS.md`](../../AGENTS.md), [`docs/SCOPE.md`](../SCOPE.md),
[`docs/DEMO.md`](../DEMO.md), [`.cursor/skills/hackathon/SKILL.md`](../../.cursor/skills/hackathon/SKILL.md).

## 1. What this repo is

Reconnect: missed-connection recovery for HKG transfer agents. Demo
**16 November 2026**. Monorepo (`pnpm-workspace.yaml`: `packages/*`, `apps/*`).

| Path | What it is |
| --- | --- |
| `packages/engine` | Pure TypeScript triage. **`dependencies: {}`**. Zero LLM. MCT table, UM/WCH buffers, unsplittable parties, downgrade protection. Every public result carries `reasoning: string[]`. Fixtures: `packages/engine/tests/scenarios/` (JSON 01–40). |
| `packages/data` | Seeded HKG evening bank: `generateEveningBank(seed)`. First CX inbound is **CX254**. Named desk PNRs in `src/passengers.ts`. |
| `packages/sim` | Deterministic clock. `injectTyphoon()` (90 min) and `injectFlightDelay("CX254", 180)`. `demoMetrics("hkg-demo")`. Same seed → same output. |
| `apps/console` | Next.js iPad-landscape desk. Default adapter: sim + engine. Mock seam: `NEXT_PUBLIC_CONSOLE_ADAPTER=mock`. Glass: `station-header`, `triage-queue`, `connection-panel`, `action-drawer`. |
| `e2e/` | Playwright six-step path (`e2e/demo.spec.ts`). |
| `docs/` | SCOPE, DEMO, LATER, QUESTIONS, HACKATHON, claims, competitive, survey, this briefing. |

**Decision vs LLM (this is the pitch):** `packages/engine` decides what is
true (feasibility, ranking, options). LLM lives **only** in
`apps/console/lib/llm/*` (draft + summarise) plus `POST /api/draft`.
`guard.ts` drops invented flight numbers onto a Cathay Alert template.
The UI must show `reasoning[]` **verbatim**.

## 2. Read before touching

| File | One sentence |
| --- | --- |
| [`AGENTS.md`](../../AGENTS.md) | Contract: engine purity, claims, PRs only, no SCOPE unfreeze. |
| [`docs/SCOPE.md`](../SCOPE.md) | Saturday is the desk loop + DEMO + claims + pilot **paper**. Nothing else. |
| [`docs/DEMO.md`](../DEMO.md) | Six Playwright steps. Sacred. No seventh step. Never mock `Date.now()`. |

Do not invent features. Tempted? [`docs/LATER.md`](../LATER.md). Ambiguous?
[`docs/QUESTIONS.md`](../QUESTIONS.md), then the simplest interpretation.

## 3. How to run

From root `package.json` (and the console package). Verify after `pnpm install`.

| Command | What it does |
| --- | --- |
| `pnpm install` | Workspace install (`packageManager`: pnpm 10). |
| `pnpm typecheck` | `tsc --noEmit` in engine, data, sim, console. |
| `pnpm test` | Recursive Vitest. **Already red on `origin/main`** inside `packages/engine`: `kraken.test.ts` still asserts `docs/claims` is absent, and four scenario regexes disagree with current `option-reason` prefixes. Do not “fix” that unless you hold an engine claim. data / sim / console tests are expected green. |
| `pnpm test:demo` | Playwright against `pnpm --filter console dev:e2e` (port 3100). Locks [`docs/DEMO.md`](../DEMO.md). |
| `pnpm --filter console dev` | Next.js Turbopack desk. Station clock is **sim** time (`Asia/Hong_Kong`). |
| `pnpm --filter <pkg> test` | Package-local Vitest (`engine` includes coverage; engine src must stay 100%). |
| `pnpm --filter engine bench` | Kernel ns/op + checksums. Read `docs/engine/SPACE.md` first. |
| `pnpm briefing:csv` / `briefing:pdf` | Competitive-intel site in this folder — **not** the demo path. |

Done means: `pnpm typecheck && pnpm test && pnpm test:demo`, with the known
engine red on main called out if you did not touch engine.

## 4. How to make a change

Actual [`AGENTS.md`](../../AGENTS.md) workflow. Do not invent another one.

1. Branch off `main`. PRs only. Never push to `main`. Never force-push.
2. Claim a glob in [`docs/claims/`](../claims/) (`status: claimed` in the
   **same commit** as the first edit). One writer per glob. Engine claims
   are a **queue**.
3. Small conventional commits.
4. No features outside SCOPE. No clever helpers; no new UI libraries
   (shadcn only). New file ≤ 200 lines.
5. `/hackathon` before adding product work or spawning agents. Pitch is
   `apply` (gate) + `90s` (demo words). No `/pitch` skill. No builder swarm.
6. Compound / nudge / steal **only when asked** →
   [`.cursor/skills/compound/SKILL.md`](../../.cursor/skills/compound/SKILL.md).
   One legal steal. Append `docs/compound/log.md` or move one COMPOUND Next.
   Do not implement LATER / Never **product** features.

## 5. Agent onboarding protocol

1. Read AGENTS.md, SCOPE.md, DEMO.md. Then this file. Then the claim board.
2. Treat `docs/briefing/` as orientation. Never as a license to expand SCOPE.
3. `packages/engine`: zero runtime deps, zero LLM, pure functions, `reasoning[]`.
4. LLM only in `apps/console/lib/llm/*`. Never for decisions.
5. Do not edit DEMO / `e2e/` unless the task is the six-step path itself.
6. Ambiguity → `docs/QUESTIONS.md` + simplest interpretation. Do not block.
7. Claim the glob. Engine: wait if another engine claim is `claimed`.
8. Checker as in §3. Paste output in the claim before `done`.
9. Verifier is readonly ([`.cursor/agents/verifier.md`](../../.cursor/agents/verifier.md)).
   It never claims product globs and it does not unfreeze SCOPE.

### Starter prompt (copy-paste)

```
You are in bobshenruililin/Cathay2026 (Reconnect). Read AGENTS.md,
docs/SCOPE.md, docs/DEMO.md, then docs/briefing/HOW_TO_WORK.md.
docs/briefing/ is orientation, not the spec.

Engine: packages/engine has zero runtime deps and zero LLM. Pure functions.
Every output includes reasoning: string[]. UI shows it verbatim.
LLM only in apps/console/lib/llm/* (draft / summarise). Never for decisions.
Demo path (docs/DEMO.md) is sacred — pnpm test:demo stays green. Never mock
Date.now(). Same sim seed → same output.

Do not unfreeze docs/SCOPE.md. No seventh DEMO step. No passenger /chat.
If ambiguous, write docs/QUESTIONS.md and pick the simplest interpretation.
Claim a glob in docs/claims/ before editing. One writer per glob; engine is
a queue. Small conventional commits. PRs only. Never force-push. Never main.

Compound / nudge / steal only when the user asks; then
.cursor/skills/compound/SKILL.md. One legal steal. Do not implement
LATER/Never product features.

pnpm test is already red on origin/main in packages/engine (kraken.test.ts
+ scenario regexes). Do not “fix” engine unless that glob is your claim.
```

## 6. Source of truth

| Need | File |
| --- | --- |
| In / out of Saturday | [`docs/SCOPE.md`](../SCOPE.md) |
| Six-step demo | [`docs/DEMO.md`](../DEMO.md) |
| Agent contract | [`AGENTS.md`](../../AGENTS.md) |
| Map + run | [`README.md`](../../README.md) |
| Parked ideas | [`docs/LATER.md`](../LATER.md) |
| Ambiguity / simplest call | [`docs/QUESTIONS.md`](../QUESTIONS.md) |
| Spine, LIVE vs SIM, prize math | [`docs/HACKATHON.md`](../HACKATHON.md) |
| 3-minute pitch notes | [`docs/PITCH_NOTES.md`](../PITCH_NOTES.md) |
| Altéa / FIDS / CANS paper | [`docs/PILOT_PROPOSAL.md`](../PILOT_PROPOSAL.md) |
| Stage numbers | [`docs/METRICS.md`](../METRICS.md) |
| Claims leases | [`docs/claims/`](../claims/) |
| Competitive markdown | [`docs/competitive/`](../competitive/) |
| Survey cards | [`docs/survey/`](../survey/) |
| Compound OS | [`docs/COMPOUND.md`](../COMPOUND.md), [`.cursor/skills/compound/SKILL.md`](../../.cursor/skills/compound/SKILL.md) |
| `/hackathon` | [`.cursor/skills/hackathon/SKILL.md`](../../.cursor/skills/hackathon/SKILL.md) |
| Engine perf | [`.cursor/skills/algorithm-engineer/SKILL.md`](../../.cursor/skills/algorithm-engineer/SKILL.md) |
| This orientation | [`docs/briefing/`](./) |
