# Reconnect scorecard

Compare like with like. Source: [`docs/briefing/data/scorecard.json`](../briefing/data/scorecard.json). Visual: briefing site § Scorecard.

Scale **1–5**. **Collision is worse when high** (5 = sounds like we replace Passenger Recovery). The chart inverts it to “clear lane” = 6 − collision.

Engine citations for the Reconnect row: `packages/engine/src/mct.ts` (CX_CX 50 min, walk 10, WCH +15, UM +20), `score.ts` (tier×3 + seat×2 − delay/10), `apps/console/lib/llm/guard.ts`, `docs/PILOT_PROPOSAL.md`.

| Product | BU fit | Theater | Path | Collision | Cite |
|---|---|---|---|---|---|
| **Reconnect** | 5 | 3 | 5 | 4 | MCT + walk + UM/WCH; guard; Altéa read week 1 |
| FlyLab 2025 | 5 | 3 | 4 | 1 | Employee track: pilots + IT, summarise existing briefings |
| Fight4Flight 2017 | 2 | 3 | 2 | 2 | Passenger re-plan, no desk. Runner-up |
| Passenger Recovery | 5 | 2 | 5 | 5 | 8,000 pax / 40 min. CX production ~2018 |
| ConnectionSaver | 5 | 4 | 5 | 2 | Walk-time SMS. Hold, not rebook |
| ChatGPT trip planner | 1 | 2 | 1 | 1 | CathayConnect (angusf777). Foil |

**How to read it**

- Reconnect *should* score high on collision until the pitch says **beside**, not **instead**. That is the kill shot.
- Reconnect theater is a 3 until we *narrate* the typhoon button as ops, not as architecture.
- FlyLab is the 2025 analogue: employee, existing data, named ops, 8-week path. Copy the *shape*, not the *domain*.
- Fight4Flight is the foil: delay-replan without a named desk.
- Passenger Recovery is the incumbent, not the enemy. Mass IROPS is its job.
- ConnectionSaver is the walk-time ancestor. Cite it if a judge says “MCT is just a number in Altéa.”
- ChatGPT trip planner is the participant-repo median. Do not demo like one.

## Incumbent CX IROPS stack (public, 2019)

Rogers / Ling (Airport Industry Review, “Typhoon Trouble”): CX combined **Amadeus Passenger Recovery**, **Accenture Rebooking Experience** (self-rebook chatbots), and **15below** customer communication. Public figure on the Amadeus side: ~8,000 passengers in 40 minutes.

Reconnect week 1: **read** Altéa + FIDS MQTT + CANS after human confirm. No Altéa write. That is how the desk sits beside mass reaccom, not on top of it.

## Copy vs foil vs incumbent

From `copyOrFoil` on each project:

- **copy-pitch:** FlyLab, NAAR, GingTrip, ConnectionSaver, Fight4Flight (the missed desk).
- **copy-engineering:** GME 2021 (open rules), Open MCT, SpaceX-class clock/sim, Reconnect.
- **foil:** U-Explore-as-lifestyle, Aviator, typical ChatGPT planner, ReservaCathay GPT offers.
- **incumbent:** Passenger Recovery, Accenture rebooking bots, 15below comms.
