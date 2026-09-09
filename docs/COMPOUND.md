# Compounding playbook

Cathay Hackathon 2026 judges for **feasibility**, Business Unit involvement,
and adoptability — not a Kafka demo. Drive this board with
`.cursor/skills/compound/SKILL.md`. Database: `docs/survey/index.md`.

## Operating rule

Every PR either moves one Next → Done (paste checker) **or** appends one
lesson to `docs/compound/log.md` that names a file or a Never. Tempted
feature: add to LATER and this board; do not build it. Next cap **12**.
Do not shrink Never without `docs/QUESTIONS.md`.

## Scorecard

| Lens | Bar | Reconnect | Gap |
| --- | --- | --- | --- |
| Named BU | HK Express, Cargo, pilots | Gate agent + Altéa office in PILOT | Keep; say HKG Transfer / Ground |
| Feasibility | Named feed or physical slice | `docs/PILOT_PROPOSAL.md` + SIM badge | Offline draft talk beat |
| Decision | FlyLab summarises | Engine decides, `reasoning[]` | Keep; say it |
| Number | Fake €25M vs SWISS minutes | `docs/METRICS.md` from sim | Keep; never vendor ROI |
| Honesty | Vendors exist | No Altéa write week 1 | Not Amadeus Passenger Recovery |

## Done

- Pure `packages/engine`, zero runtime deps, no LLM in decisions (`purity.test.ts`)
- Verbatim `reasoning: string[]` in the console
- `adversarial-guard` (ground-control): instruction-override + invented flights
  fall back in `apps/console/lib/llm/guard.ts`. Checker: `pnpm --filter console test`
- Deterministic `packages/sim`; DEMO clock is not `Date.now()`
- Named user (HKG transfer agent); PILOT names Altéa / FIDS MQTT / App push
- Survey cards + compound skill + this board
- `named-BU` + engine-true line in `docs/PITCH_NOTES.md` (kairos, flylab, crew-ops)
- `quiet-default` (amadeus-disruption-agent): healthy connections counted as
  silent, not queued. Checker: `pnpm --filter console test` && `pnpm test:demo`
- `sim-badge` (aegisops-ai): SIM on `station-header.tsx`; Offline draft when
  `/api/draft` misses or the guard falls back. Checker: `pnpm --filter console
  test` && `pnpm test:demo` (step 1 asserts `sim-badge`)
- `action-verbs` (connectguard): Hold / Escort / Protect / Wait prefixes in
  `packages/engine/src/option-reason.ts` without dropping existing phrases.
  Checker: `pnpm --filter engine test`
- `metrics-from-sim` (connectguard): `docs/METRICS.md` locked to
  `packages/sim` `demoMetrics("hkg-demo")`. Checker: `pnpm --filter sim test`
- `peak-flood` (support-operations-dashboard): typhoon/delay flood chip on
  `triage-queue.tsx`. Checker: `pnpm --filter console test` && `pnpm test:demo`
- `overnight-label` (passenger-recovery-optimization): next-calendar-day
  options say overnight; UM skip them. Checker: `pnpm --filter engine test`
- `engine-ports` (nasa-fprime): console/sim/data import `engine` public API
  only. Checker: `pnpm --filter engine test`
- `no-php-runtime` (openflights): `packages/data` has no PHP / OpenFlights
  import. Checker: `pnpm --filter data test`
- `no-openmct-embed` (nasa-openmct): console does not import Open MCT.
  Checker: `pnpm --filter console test`
- `thin-leases` (kraken): no `docs/claims/` framework. Checker:
  `pnpm --filter engine test`
- `no-gurobi` (airline-disr-mgt): engine purity bans Gurobi/OR-Tools imports.
  Checker: `pnpm --filter engine test`
- `worker-tablet` (touchcx-2017): pitch says the iPad is the worker's.
  Checker: docs
- `one-journey` (sia-sqxp-2017): pitch is HKG missed connect only. Checker: docs
- `no-passenger-copilot` (traavl): no `/chat` route. Checker:
  `pnpm --filter console test`
- `phase2-hold-qa` (pfrsp): hold-outbound stays Later. Checker: docs
- `cargo-later` (naar-2023): cargo ULD not built. Checker: docs
- `no-green-points` (cathay-green-2022): METRICS forbids hotel-night invention.
  Checker: docs
- `json-cases` (engine-hardening): 40 JSON gate-desk fixtures + SSR mapping.
  Checker: `pnpm --filter engine test`
- `handling-flags` (engine-hardening): UM / WCH / party chips on triage rows.
  Checker: `pnpm --filter console test`
- `fast-check-10k` (engine-hardening): at-risk and options properties.
  Checker: `pnpm --filter engine test`
- `pin-desk-cases` (engine-hardening): named JSON-case PNRs (`W4N9KD` Mei
  Chan UM, `P8T2LM`, `Q1H6VB`, `SSRWCH`) on live CX254 feeders.
  Checker: `pnpm --filter data test` && `pnpm --filter sim test`
- `draft-handling` (engine-hardening): draft prompt/mock SMS mention UM /
  wheelchair / party; LLM still does not rank.
  Checker: `pnpm --filter console test` && `pnpm test:demo`
- `panel-ssr-flags` (engine-hardening): connection panel uses the same SSR
  helpers as the queue (case 12 `SSRWCH` shows WCH when selected).
  Checker: `pnpm --filter console test` && `pnpm test:demo`
- `pin-ssr-umnr` (engine-hardening): case 13 `SSRUMNR` Mina Choi on a live
  CX254 feeder (UMNR without `um` flag). Checker: `pnpm --filter data test`
  && `pnpm --filter sim test`
- `pin-mixed4` (engine-hardening): case 40 `MIXED4` Cole Family (UM +
  wheelchair + party of 4) on a CX254 feeder. Checker: `pnpm --filter data
  test` && `pnpm test:demo`

## Next

| id | bucket | steal-from | recipe | checker |
| --- | --- | --- | --- | --- |
| hold-outbound | LATER | connectguard, pfrsp, airline-disr-mgt | Do not build | — |
| walk-graph | LATER | traavl | Do not build | — |
| coc-rag | LATER | amadeus-disruption-agent | CoC as draft context only; do not rank | — |
| visual-percy | LATER | nasa-openmct | Visual QA already out of demo | — |
| cargo-uld | LATER | naar-2023 | Same engine, different entities | — |

## Never

LLM ranks or rebooks. Kafka / Mapbox / six-agent story. Passenger chatbot as
the pitch. Gurobi or quantum on stage. OpenFlights PHP. Kraken-ifying claims.
Embedding Open MCT or F Prime. ADS-B as PNR/MCT. Fake ROI. Replacing Amadeus
Passenger Recovery. Seventh DEMO step. `Date.now()` as station clock.
