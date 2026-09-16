# Team

Orientation, not the spec. Canonical product: [`docs/SCOPE.md`](../SCOPE.md).

## Reconnect (plain English)

HKG transfer agents recover **missed connections** in the last ~90 minutes
before a gate closes. Altéa queue Q77 stays cryptic. Mass IROPS
(Amadeus Passenger Recovery) already rebooks the easy thousands.

Reconnect is one **worker iPad**: at-risk PNRs from a seeded evening bank,
ranked recovery options, human-readable `reasoning[]`, a guarded SMS/push
draft, Approve. Typhoon and CX254 buttons flood the bank in the demo. The
engine decides what is true. The model only drafts the message.

Verified in-repo: [`docs/DEMO.md`](../DEMO.md), [`docs/PITCH_NOTES.md`](../PITCH_NOTES.md),
[`docs/PILOT_PROPOSAL.md`](../PILOT_PROPOSAL.md) §1.1.

## Philosophy (current product)

| We are | We are not |
| --- | --- |
| An **ops tool** for the transfer desk | A passenger chatbot (`apps/console/lib/never-chatbot.test.ts`) |
| Explainable, deterministic `packages/engine` | LLM ranking or rebooking |
| LLM **drafts only** (`apps/console/lib/llm/*`) | “AI for aviation” as the noun |
| Passenger **constraints** (UM, WCH, unsplittable party) priced in MCT + seating | A PRM passenger app (FlyMate foil) |
| A polished **six-step demo** + honest SIM | Fake Altéa write / live FIDS on 16 Nov |

Week 1 of any real desk is **read** Altéa + FIDS MQTT + CANS after human
confirm. `RECONNECT_PILOT=off` returns the desk to cryptic Q77.
That is the [pilot](../PILOT_PROPOSAL.md), not Saturday’s sim.

## How this team was built

Originally **three** members; max **five**. Seats were not filled for the
sake of it.

Criteria: complementary skills; independent ownership; technical execution;
product thinking; judge Q&A; visual / demo production; low coordination
overhead; people we would enjoy the weekend with.

Five people only helps if work can happen **in parallel**. Each meaningful
workstream needs a clear owner.

## Who is in the repo today

GitHub owner / only human collaborator: **Shen Ruililin** (`bobshenruililin`).
Commits also from Cursor agents. Other original members are **not named**
in this repository — humans should write them here; agents must not invent
roles or names.

Lightweight (not rigid) split once the two joiners land:

| Person | Owns |
| --- | --- |
| Devano | Build + product (engine/console slices, Q&A on how it works) |
| Otto Ma | Story + pitch + visual / demo production |
| Shen | Integration / product / strategy / flexible execution |
| Other original members | Actual strengths they already have — do not reassign from this file |

## Candidates

| Candidate | What stood out | Fit / thought | Decision |
| --- | --- | --- | --- |
| **Devano** | Final-year HKU Data Science & Engineering. Cofounder / product-building. AI/ML, full-stack, APIs, RAG/agents. Built and pitched working prototypes. Immediately understood Reconnect ROI as **agent-minutes, rebooking speed, retention**. | Bridges engineering + product + pitch. Adds build capacity without a second spine. | **SELECTED — joining** |
| **Otto Ma** | Final-year Law, Journalism minor. Debate, mooting, HKU international technology arbitration. Part-time teacher. Owns a production studio (AE, Premiere, FCP, Photoshop; some Illustrator/Blender). | Story, live presentation, Q&A, visuals, demo tape. Complementary to a technical bench. | **SELECTED — joining** |
| Daniel Tran | HKU Econ & Finance. Python+SQL. Modelling, forecasting, A/B. 21k+ record pipeline. Business-case comps. EY Consulting Track pitch winner. | Strong analytical / commercial. More overlap; less incremental engineering than Devano. | Not selected |
| Saleem Alisha | HKU Finance / Swire Trust Scholar. AI Solutions internship. Meeting-summary AI, chatbot, UAT. SQL, Java, C++. Debate. | Strong hybrid backup. Technical depth harder to establish than Devano. | Not selected |
| Gungun Jain | HKU Econ & Finance. Consulting, partnerships, outreach, leadership, client-persona / sales-journey, public speaking. | Capable. Overlap with areas already represented. | Not selected |
| CDS freshman | HKU Computing & Data Science. Full-ride. Applied as pitch lead. Oratory, business strategy, interpersonal. | Insufficient evidence / projects / CV at selection vs others. | Not selected |

## Parallel workstreams (so five is not overhead)

| Stream | Default owner | Canonical |
| --- | --- | --- |
| Engine / sim / data | Devano (queue: `docs/claims/` — engine is one writer) | `packages/engine`, `packages/sim`, `packages/data` |
| Console / six-step path | Devano + whoever holds the console claim | `apps/console`, `e2e/demo.spec.ts` |
| 27 Sep apply + prize math | Shen | [`docs/HACKATHON.md`](../HACKATHON.md), [`.cursor/skills/hackathon/SKILL.md`](../../.cursor/skills/hackathon/SKILL.md) `apply` |
| 90s words + tape | Otto | [`docs/competitive/saturday.md`](../competitive/saturday.md), DEMO |
| Named BU / HAS human | Shen (human, not an agent) | PILOT, WINNING “humans decide” |

Agents cannot unfreeze SCOPE. Humans still freeze the hallway noun
([WINNING.md](WINNING.md) §7).
