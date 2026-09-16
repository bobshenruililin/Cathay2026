# Winning

High-signal only. Canonical files win on conflict. Store notes (pain, bets)
are **pitch-noun** advice. They do not unfreeze [`docs/SCOPE.md`](../SCOPE.md).

## 1. Current winning thesis

- **Named desk, not a model.** Airport Systems / HKG Transfer (Altéa office
  `HKGCX08AA`). Sentence one is Q77, not “AI”. [`docs/PITCH_NOTES.md`](../PITCH_NOTES.md),
  [`docs/competitive/judging-2026.md`](../competitive/judging-2026.md).
- **One object.** One connection on one worker iPad. TouchCX lineage: the
  glass is the worker’s. [`docs/HACKATHON.md`](../HACKATHON.md).
- **Beside Passenger Recovery, not instead.** CX already mass-rebooks
  (~8,000 pax / 40 min). Wedge = last 90 minutes: MCT + walk, UM, WCH,
  unsplittable party, verbatim `reasoning[]`. [PILOT §1.1](../PILOT_PROPOSAL.md),
  [pattern 7](../competitive/patterns.md).
- **Engine-true, LLM-last.** Engine ranks; model drafts; `guard.ts` strips
  invented flights. FlyLab shape: summarise what is true; human Approve.
- **Theater is the typhoon button; distinctive is handling.** Every IROPS
  demo will have a delay slider. Chips on `MIXED4` (Cole Family) are LIVE.
  175 at-risk rows are leftover after incumbents — not the pain.
- **Honesty.** Week 1 = Altéa **read**, FIDS MQTT, CANS after confirm. No
  `PNR_AddMultiElements`. SIM badge. Numbers only from
  `demoMetrics("hkg-demo")` ([`docs/METRICS.md`](../METRICS.md)).
- **Clock.** Corporate bonus-stake × gated-then-sprint. **27 Sep application
  is the first product.** 14–16 Nov is freeze, not a rebuild.
  [`.cursor/skills/hackathon/SKILL.md`](../../.cursor/skills/hackathon/SKILL.md).

## 2. What past winners teach

Not “have a good pitch.” From [`docs/competitive/`](../competitive/) and
[`docs/survey/`](../survey/):

| Lesson | Who | Steal |
| --- | --- | --- |
| Named BU + one physical/screen object | GingTrip trolley, NAAR cargo CV, TouchCX tablet | We already have the typhoon button. Do not wait a year (L25). |
| Employee-track: staff + IT, LLM summarises | FlyLab 2025 | Pair transfer agent + Airport Systems. Do not copy briefing-pack domain. |
| Repeat teams narrow | GingTrip lost 2023, won 2024 | Log coach feedback; do not expand SCOPE. |
| Lifestyle wins **student** track | U-Explore / Kairos, cxDiscovery | Steal named-BU; do not build a loyalty journey. |
| Delay-replan without a desk **places, does not win** | Fight4Flight 2017 RU | Invert: agent iPad, no passenger `/chat`. |
| PRM as a passenger GenAI app lost | FlyMate 2023 2nd RU | WCH is +15 in `mct.ts`, not a chatbot (L29). |
| Copying last year’s technique loses | FlyVision after NAAR | Do not rebuild cargo CV. |
| Hardware is optional | Niki Jr. robot vs FlyLab | Do not add a robot (L04). |
| First pitch can run long; finals still need the click | Cathay Green 2022 | Narrate DEMO 3–6; no architecture tour (L28). |
| Champion GitHub is usually null | [cathay-winners.md](../competitive/cathay-winners.md) | Do not fill 2018/2021 trophies from GitHub (GME is a participant). |

Any-hackathon axes: [`.cursor/skills/hackathon/references/archetype.md`](../../.cursor/skills/hackathon/references/archetype.md).
Voices inside modes, not workers with branches.

## 3. What makes Reconnect distinctive (current product only)

Already in the tree — not a future slide:

- Deterministic MCT + additive UM (+20) / WCH (+15) / walk (+10) in
  `packages/engine/src/mct.ts`. Table does not move.
- Unsplittable party, UM on CX metal, no UM overnight, downgrade protection
  with `reasoning[]` (`options.ts`, `seating.ts`, `option-reason.ts`).
- Queue/panel chips `UM` / `WCH` / `party of N` (`apps/console/lib/handling-flags.ts`).
- Live adapter is the sim; healthy connections stay silent; Peak flood chip;
  SIM + offline-draft talk beat (not step 7).
- Flight-number guard. Approve removes the PNR.
- Six Playwright clicks. Kill-switch copy lives in the pilot note.

## 4. What we should NOT do

| Anti-pattern | Source |
| --- | --- |
| Replace Passenger Recovery / quote SWISS minutes or ConnectGuard €25M | L10, L20, METRICS |
| Passenger chatbot, copilot, `/chat`, Fight4Flight glass | L07, L29, never-chatbot |
| LLM ranks or rebooks; Kafka / six-agent IROPS; Gurobi on stage | COMPOUND Never, purity tests |
| Seventh DEMO step; `Date.now()` as station clock | DEMO, HACKATHON |
| Altéa write, public FIDS scrape, TOBT write, hold-the-outbound, hotel/EU261, robot | LATER, L16–L18, L04 |
| Second spine this month (AOCC hold iPad, bag tracker, HX super-app, Gemini traveler toys) | Store win-bets / judge-panel — **rejected as product** |
| Unfreeze SCOPE from a hallway rewrite | Hackathon skill: only a human unfreezes |

## 5. Judge questions → where the answer lives

Do not fabricate. If the file does not say it, say **unknown**.

| Seat | Likely question | Doc |
| --- | --- | --- |
| Product | Who is the user? Why not a passenger app? | PITCH_NOTES, saturday.md, Fight4Flight card |
| Operations | What happens in the last 90 minutes / Q77? | PILOT §1.1, SCOPE, mct.ts |
| Technical | Why no solver / Kafka / live PSS? | QUESTIONS, engine `dependencies: {}`, PILOT week-1 read |
| AI safety | Can the model pick a flight? | `apps/console/lib/llm/guard.ts`, DEMO step 6, L09 |
| Business | What is the 30-day path? Prize? | PILOT, HACKATHON prize math (same path: desk owner + Innovate piggyback) |
| Integration | Altéa / FIDS / CANS? Kill-switch? | PILOT §§3–5, `RECONNECT_PILOT=off` |

Unknown on purpose: who from Airport Systems sits in the room; 2018/2021
champion names; exact 2026 rubric weights
([`references/events.md`](../../.cursor/skills/hackathon/references/events.md)).

## 6. Highest-leverage improvements (docs / pitch only)

| Bucket | Do |
| --- | --- |
| **Must** | Ship the **27 Sep** apply packet (`/auto-hackathon` `apply`). Name a BU owner. Keep `pnpm test:demo` green. Pick **one** hallway noun (§7). |
| **If time** | Get **one named** HKG Transfer / Special Handling / HAS human to co-sign the packet. Rehearse MIXED4 chips + “beside, not instead.” Cut typhoon speech to load, not identity. |
| **Tempting, not worth** | Altéa write, gate-pair walks, hold button, party-batch API, WCH grade table, escort robot, cargo ULD, Percy, OpenMCT, passenger walk-push. All LATER / Never. |

Do not implement product from this list.

## 7. Hallway sentence

**Locked on `origin/main`** ([`docs/HACKATHON.md`](../HACKATHON.md),
[`references/distinctive.md`](../../.cursor/skills/hackathon/references/distinctive.md)):

> “the missed-connect iPad” / “the typhoon-button desk”

Forbidden: “the AI agent dashboard” / “the aviation copilot” / “the super-app”.

**Open PR, not merged:** [#11](https://github.com/bobshenruililin/Cathay2026/pull/11)
freeze-cut to **“the desk that doesn’t split the family.”** Same six DEMO
clicks. Typhoon stays bank load. That PR also touches `docs/DEMO.md` and
`e2e/demo.spec.ts` — humans merge it; agents do not treat it as canonical
until it is on `main`.

Pain-first (store, not SCOPE): the body that hurts is a UM / WCH / family
going dark jetty → T−15, not “175 rows.” Pitch-noun, same iPad.

## 8. Mental model for new ideas

1. Same **object** (one connection, one worker iPad)?
2. Same **six clicks** (`docs/DEMO.md`)?
3. Same **owner** (Airport Systems / HKG Transfer)?
4. LIVE path in [`docs/HACKATHON.md`](../HACKATHON.md), or labeled SIM?
5. If no: [`docs/LATER.md`](../LATER.md) or reject. Do not unfreeze. Do not
   start a second spine “for the other prize.”

New copy may **cut** speech. It may not replace the problem.
