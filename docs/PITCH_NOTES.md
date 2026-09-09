# Pitch notes (3 minutes)

**User.** HKG transfer agent, iPad landscape, evening bank. The tablet is
the worker's (TouchCX lineage), not a passenger super-app. One named
journey: HKG missed connect — not SQXP layover itinerary, not a passenger
copilot (trAAvl).

**Business Unit.** Airport Systems + HKG Ground / Transfer (Altéa office
`HKGCX08AA` in `docs/PILOT_PROPOSAL.md`). Who sits next to them: the
transfer supervisor and DCS. FlyLab won 2025 by pairing that human with IT.

**What it does.** When an inbound is late, the engine flags MCT-infeasible
connections and ranks same-day CX, next CX, and oneworld partner options.
Reasoning on screen is the engine’s `string[]`, verbatim.

**Decision split.** The engine decides what is true. The LLM decides how to
say it. Drafts are flight-number-guarded; invented flights and instruction
overrides fall back to a Cathay Alert template. No API key required for the
demo.

**What we are not.** Not Amadeus Passenger Recovery (mass Altéa rebook).
Not Fight4Flight (passenger delay app — we inverted it). Not a Kafka/Gemini
IROPS super-app. Not green-points or a hotel-night carbon claim (Cathay
Green) — the sim does not count nights. Week 1 of the pilot does not write
`PNR_AddMultiElements`.

**Number.** Seed `hkg-demo`: 123 at-risk at bank start; typhoon (90 min on
inbounds) lifts that to 176; 12 unaccompanied minors at risk stay on CX.
Full table: `docs/METRICS.md`. Do not quote ConnectGuard €25M or SWISS
2–3 minutes.

**Demo insurance.** Seeded sim, same seed → same output. Station clock is
sim time, not `Date.now()`. If the venue LLM dies, the fallback template
still sends. A **SIM** badge is on the station header. If the draft API is
down, **Offline draft** appears there too. That is a talk beat, not a
seventh DEMO step.

**Q&A ready.** Phase 1 is options the desk already has authority to book.
PFRSP / airline.disr.mgt hold-the-outbound, NAAR cargo ULD, and HKG walk
graphs are Later. No Gurobi on the demo machine. MAXCT/overnight: see
`docs/QUESTIONS.md`.
