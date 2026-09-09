# Demo path (sacred)

Six steps. Each step has a Playwright assertion in `e2e/demo.spec.ts`.
Never mock time — the header clock is `packages/sim` station time.

Run: `pnpm test:demo`

## 1. Load the console

Open the Reconnect transfer desk.

Assertion: HKG station clock is visible and is not a placeholder dash. A
**SIM** badge is on the header (live adapter). Kill-LLM / offline draft is a
talk beat, not a seventh step.

## 2. Live triage queue from sim + engine

The left column lists at-risk connections from the seeded evening bank.
Healthy connections stay off the action list; the queue header shows
`N connections OK — silent`. `packages/sim` supplies flights/connections;
`packages/engine` `triageConnection` / `generateOptions` fills status, slack,
options, and `reasoning`.

Assertion: at least one queue row is visible and engine reasoning is shown for the
auto-selected passenger.

## 3. Simulate Typhoon Delay

Click **Simulate Typhoon Delay**. The adapter calls `sim.injectTyphoon()`
(90 minutes on HKG inbounds, same constant as the mock seam). The triage
queue refreshes in place; no page reload.

Assertion: delayed-flight count increases and the queue remains on screen.

## 4. Late Inbound CX254

Click **Late Inbound CX254**. Sim delays inbound CX254 (TPE→HKG in the synthetic
bank) by 180 minutes (`CX254_DELAY_MINUTES`).

Assertion: a queue row mentions CX254 and CX254’s delay minutes are greater than 0.

## 5. Queue updates and recovery options

Select an at-risk passenger whose engine result includes recovery options.
Options show verbatim `reasoning` strings.

Assertion: a recovery option card is visible and can be selected.

## 6. Draft (guarded) + approve

Selecting an option drafts an SMS/push via `apps/console/lib/llm/draft.ts`.
Raw model text is labeled **Draft**. A flight-number guard discards hallucinated
flights and falls back to:

`[Cathay Alert] Your flight CX... has been protected on CX... departing at ...`

**Approve Rebooking & Send** removes that PNR from the live queue.

Assertion: Draft badge + message are visible; after approve, that PNR is gone.
