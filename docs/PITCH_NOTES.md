# Pitch notes (3 minutes)

**User.** HKG transfer agent, iPad landscape, evening bank. Not a passenger app.

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
IROPS super-app. Week 1 of the pilot does not write `PNR_AddMultiElements`.

**Number.** Do not quote ConnectGuard €25M or SWISS 2–3 minutes. When
`docs/METRICS.md` exists, read counts from `packages/sim` only (at-risk after
typhoon, options generated, UM kept on CX).

**Demo insurance.** Seeded sim, same seed → same output. Station clock is
sim time, not `Date.now()`. If the venue LLM dies, the fallback template
still sends. Visible SIM badge is a Next item, not a seventh DEMO step.

**Q&A ready.** Phase 1 is options the desk already has authority to book.
Hold-the-outbound and cargo ULD are Later. MAXCT/overnight: see
`docs/QUESTIONS.md`.
