# Later (not the 16 Nov demo)

Parked after the HKG transfer-desk loop is real. Do not pull these into `packages/engine` or `apps/console` before `pnpm test:demo` stays green. Scope for Saturday is [`docs/SCOPE.md`](SCOPE.md).

## Hold-the-flight

United ConnectionSaver holds the outbound using walk time and SMS with minutes remaining. That is an AOCC / ramp / ATC decision, not a transfer-desk rebook. Reconnect ranks recovery flights; it does not issue a hold. Know the map (L16). Do not demo a “hold CX250” button on 16 Nov.

## Gate-pair walks

`mct.ts` uses a flat walk buffer today. Pair-specific T1 walks (for example gate 64 → 15) need a gate-pair table and live FIDS gates. Add only after the FIDS MQTT feed in [`docs/PILOT_PROPOSAL.md`](PILOT_PROPOSAL.md) is real. Until then the flat buffer is the honest model.

## Passenger walk-time push

ConnectionSaver’s passenger-visible countdown is a different CANS template from “you are protected on CX252.” Our week-1 push is agent-approved rebooking confirmation. A minutes-remaining walk push is after that loop is live.

## A-CDM TOBT

HKG A-CDM already shares TOBT/TSAT. “Missing passenger” is a documented delay reason. Writing TOBT from Reconnect is airport-ops, not T1 recovery. Read FIDS `eventTime` only. Do not scrape the public FIDS website (L18).

## Duty of care

Hotel, meal, and EU261 chaining after a missed connection. Mass care is an incumbent process. Out of SCOPE. Do not add a hotel module to the iPad.

## Yield-aware score

`score.ts` is `tier*3 + seatMatch*2 - delay/10`. Yield, overbooking, and GPT compensation (ReservaCathay) are foils. Do not put revenue management in the engine for Saturday. Do not invent impact numbers we have not measured (L20).

## Hardware / robot

Niki Jr. won presentation with a Polaroid robot. FlyLab won the employee track without hardware. Do not add a robot (L04).

## MILP aircraft-crew recovery

Aircraft and crew recovery solvers are AOCC. Not the transfer desk (L17).

## After the desk loop is live

- Cargo / ULD Reconnect (same engine, different entities). NAAR-shaped.
- Party-batch API (one call that keeps several PNRs on the same party).
- Partner seat inventory beyond the synthetic pool.
- LLM in ranking, feasibility, or option generation.
- CX Conditions of Carriage / EU261 as RAG **for drafts only** — never for ranking.
- Goal 3 data-realism (`packages/data/SOURCES.md`, OpenFlights as a **citation**, extra canned disruptions).
- Goal 4 extras: `docs/ARCHITECTURE.md`.
- Visual QA / Percy (Open MCT pyramid). Playwright demo stays the HITL bar.
- OpenMCT-style telemetry plugins. Do not embed Open MCT.
