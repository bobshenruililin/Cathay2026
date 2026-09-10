# Reconnect scorecard

Compare like with like. Source: [`docs/briefing/data/scorecard.json`](../briefing/data/scorecard.json). Visual: briefing site § Scorecard.

Scale **1–5**. **Collision is worse when high** (5 = sounds like we replace Passenger Recovery). The scatter plots adoption path on X and collision on Y (worse up). We want high/low. Reconnect is high/high until the pitch says beside.

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

HX is on **Navitaire New Skies** (2015). GingTrip/U-Explore attached to that BU. Do not pitch one PSS write for CX and HX.

Amadeus **Self Re-accommodation** already exists so airport agents handle only the complex cases. That is the desk. Do not add a second self-rebook bot.

## Copy vs foil vs incumbent

From `copyOrFoil` on each project:

- **copy-pitch:** FlyLab, NAAR, GingTrip, SMASH (pain without theater), ConnectionSaver, Fight4Flight (the missed desk).
- **copy-engineering:** SyncCart, Open MCT, SpaceX-class clock/sim, Reconnect.
- **foil:** U-Explore-as-lifestyle, Aviator, Hacksmart, GME-as-trophy, typical ChatGPT planner.
- **incumbent:** Passenger Recovery, Accenture bots, 15below, Amadeus Self Re-accommodation, Sabre IROPS, Plan3, HRS, HX Navitaire.
