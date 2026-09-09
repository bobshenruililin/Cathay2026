# Numbered learnings

Source of truth: [`docs/briefing/data/learnings.json`](../briefing/data/learnings.json). Each row has a **Pitch / Demo / Pilot / LATER** tag and `sourceIds` into the project database.

| ID | Tag | Claim | Sources |
|---|---|---|---|
| L01 | Pitch | Open with Airport Systems / HKG transfer desk, not “AI for aviation”. | FlyLab, GingTrip, NAAR |
| L02 | Pitch | Name two beneficiaries: the passenger and the typhoon queue. | NAAR, cxDiscovery |
| L03 | Demo | Narrate demo steps 3–6 as ops theater (typhoon, CX254, reasoning, approve). | GingTrip, Niki Jr., Reconnect |
| L04 | LATER | Do not add hardware or a robot. FlyLab won without one. | Niki Jr., FlyLab |
| L05 | Pitch | Use coach language: Q77 + Altéa cryptic is the bottleneck. | FlyLab, Passenger Recovery |
| L06 | Pitch | Claim ESG only if we can count fewer stranded nights. Otherwise omit. | Cathay Green, GingTrip |
| L07 | Pitch | Agent-in-the-loop is why Fight4Flight lost and we should not. | Fight4Flight, Reconnect |
| L08 | Pitch | Pair the pitch with a real CX role (transfer agent + IT), FlyLab-style. | FlyLab |
| L09 | Demo | Say: LLM drafts; engine decides; guard strips hallucinated flights. | Reconnect, amadeus-disruption-agent |
| L10 | Pilot | Sit beside Passenger Recovery as the last-90-minute special-handling layer. | Passenger Recovery, Rogers 2019 |
| L11 | Pilot | Pilot metrics already in PILOT_PROPOSAL: 5s queue, reasoning not from LLM, flight-number-safe push. | Reconnect |
| L12 | Pitch | Call the engine a control cycle on station time. MCT table is the DSL. | SpaceX FSW, Reconnect |
| L13 | Pitch | Seeded sim = HOOTL. Live adapter = HITL. `RECONNECT_PILOT=off` is abort. | SpaceX FSW, Reconnect |
| L14 | Demo | Describe the iPad as one glass (queue, connection, action). Open MCT analogue. | Open MCT, Reconnect |
| L15 | Pitch | Walk + WCH + UM is the wedge. ConnectionSaver made walk-time a product. | ConnectionSaver, Reconnect |
| L16 | LATER | Hold-the-outbound is a different decision. Park it in LATER. Know it exists. | ConnectionSaver |
| L17 | LATER | Do not import MILP aircraft-crew recovery. That is AOCC, not T1. | Passenger Recovery |
| L18 | Pilot | Do not scrape public FIDS. Pilot uses operational MQTT. OpenSky is research-only. | HKG A-CDM, Reconnect |
| L19 | Pitch | Use ChatGPT trip planners and GPT compensation as foils, not as features. | CathayConnect, ReservaCathay, Syd |
| L20 | Pitch | Do not invent impact numbers. NAAR and ConnectionSaver led with real ones; we do not have them yet. | NAAR, ConnectionSaver |

Demo-tagged lines are already true in this repo. Do not rewrite `packages/engine` to satisfy a pitch sentence. LATER items live in [`docs/LATER.md`](../LATER.md).
