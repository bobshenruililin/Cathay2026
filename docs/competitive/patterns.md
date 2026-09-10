# Named patterns (the argument)

These ten claims are the briefing. Project cards exist so you can argue them. Each pattern has a winner behaviour, a Reconnect status, and a pitch sentence.

Source of truth: [`docs/briefing/data/patterns.json`](../briefing/data/patterns.json).

## 1. Named BU beats generic AI

Winners attach to **HK Express**, **Cargo**, **Inflight**, **Pilots**. Generic “AI travel assistant” is the 2017–2025 participant default and does not match 2026 judging.

Reconnect already owns a named desk: **HKG transfer / IROPS**. Do not dilute that in the first 90 seconds of the pitch.

## 2. 90-second theater

Judges must *see* a trolley, robot, briefing card, or typhoon button. NAAR, GingTrip, Kairos, and FlyLab all had a physical or screen artifact a camera could hold.

Reconnect’s theater is already specified: **typhoon button → ranked list + `reasoning[]`**. Keep it. Do not replace it with a slide of architecture. GingTrip (trolley) and Niki Jr. (robot) are theater proofs, not a hardware path.

## 3. Dual beneficiary

Passenger *and* a BU number: cargo yield, crew hours, inflight waste, delay minutes, or transfer labour. Empathy-only products lose to dual-beneficiary ones when the room is mixed CX / HX / Cargo.

Reconnect’s dual: **connection saved + agent minutes + denied-boarding risk**. Say the labour line; do not only say “passenger first.”

## 4. Feasibility 2026 ≠ lifestyle 2025

Employee FlyLab (pilots + IT, summarise existing briefing packs, humans decide) is the closer analogue than Kairos/U-Explore (lifestyle / loyalty journey).

Reconnect is a **desk tool**. Pitch week-1 Altéa *read* + FIDS MQTT. Do not pitch a consumer app.

## 5. Champions rarely open-source

GitHub is a **participant** corpus. Champion GitHub is usually **null**. Do not treat stars as quality. See [github-corpus.md](github-corpus.md).

## 6. Delay-replan without a desk owner loses

Fight4Flight (2017 runner-up) notified and re-planned from the passenger side. TouchCX (crew tablet) won. Reconnect’s **agent-in-the-loop** is the 2026 fix for that failure mode.

## 7. Cathay already bought mass IROPS

Passenger Recovery (~8,000 pax / 40 min) + Accenture chatbots + 15below. Pitch **beside**, not **instead**. See [reconnect-scorecard.md](reconnect-scorecard.md) and the incumbent diagram on the briefing site.

## 8. LLM-decides-rebooking is a foil

BU judges who have been burned by hallucination will reject “the model picks CX251.” Guarded draft + deterministic engine is the product. `guard.ts` strips invented flight numbers. Engine has zero LLM calls.

## 9. SpaceX-class ops, said in airline English

Control cycle, mission clock, sim/HITL, config DSL, kill switch. Reconnect already has the *shape* (`nowOverride`, `sim.ts`, `mct.ts` tables, never mock `Date.now()`). Translate it: **clock, replay, MCT table, human confirm**. Do not say “SpaceX” in the pitch unless the room already used that frame.

## 10. Walk time and special handling are the wedge

Mass reaccom does not own UM/WCH/party + T1 walk. United ConnectionSaver (2019, production) already treated walk-time as a product (SMS with minutes). Reconnect’s MCT table is the 2026 version of that wedge. Hold-the-flight stays in [LATER](../LATER.md).

---

If two patterns conflict in a draft sentence, keep **1, 4, 7, 8**. Drop lifestyle language. Drop “we replace Amadeus.”
