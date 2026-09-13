# Reconnect (Cathay2026)

Missed-connection recovery for HKG transfer and gate agents. Stage demo: **16 November 2026**.

| Package | Role |
| --- | --- |
| `packages/engine` | Pure TypeScript triage. Zero runtime deps, zero LLM. MCT table, UM/wheelchair buffers, unsplittable parties, downgrade protection, `reasoning[]`. |
| `packages/data` | Seeded HKG evening bank (`generateEveningBank(seed)`). First CX inbound is **CX254**. |
| `packages/sim` | Deterministic clock. `injectTyphoon()` (90 min) and `injectFlightDelay("CX254", 180)`. Same seed → same output. |
| `apps/console` | iPad landscape desk. Live adapter is sim + engine. Mock seam: `NEXT_PUBLIC_CONSOLE_ADAPTER=mock`. LLM only drafts messages. |

## Run

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm test:demo          # Playwright, six-step path in docs/DEMO.md
pnpm --filter console dev
```

Station clock is sim time (`Asia/Hong_Kong`). Do not mock `Date.now()`.

## Docs

- Agent contract: [`AGENTS.md`](AGENTS.md)
- Demo path (sacred): [`docs/DEMO.md`](docs/DEMO.md)
- Scope / later / questions: [`docs/SCOPE.md`](docs/SCOPE.md), [`docs/LATER.md`](docs/LATER.md), [`docs/QUESTIONS.md`](docs/QUESTIONS.md)
- Spine mirror (do not fork): [`docs/HACKATHON.md`](docs/HACKATHON.md)
- Pitch notes: [`docs/PITCH_NOTES.md`](docs/PITCH_NOTES.md)
- Pilot (Altéa PNR, FIDS MQTT, Cathay App push): [`docs/PILOT_PROPOSAL.md`](docs/PILOT_PROPOSAL.md)
- Claims (one writer per glob; engine is a queue): [`docs/claims/`](docs/claims/)
- Compound OS: [`docs/COMPOUND.md`](docs/COMPOUND.md), [`docs/survey/`](docs/survey/), [`docs/compound/log.md`](docs/compound/log.md)
- Competitive markdown: [`docs/competitive/README.md`](docs/competitive/README.md)
- Teammate briefing (not on the demo path): [`docs/briefing/README.md`](docs/briefing/README.md)

## Agents / `/hackathon`

One skill: [`.cursor/skills/hackathon/SKILL.md`](.cursor/skills/hackathon/SKILL.md). Always-on pointer: [`.cursor/rules/hackathon.mdc`](.cursor/rules/hackathon.mdc).

| Invoke | Mode | Use for |
| --- | --- | --- |
| `/auto-hackathon` | `recon` | T+0 rules. Refresh event prior. |
| `/auto-hackathon` | `apply` | 27 Sep application **and** gated-clock pitch copy. |
| `/hackathon` | `identity` / `stop` / `claims` | Hallway noun; delete adds; LIVE paths. |
| `/hackathon` | `90s` | Six-step demo click **and** 15/16 Nov pitch words. |
| (delegate) | `compound` | [`.cursor/skills/compound/SKILL.md`](.cursor/skills/compound/SKILL.md) — one legal steal. |
| (delegate) | `verifier` | [`.cursor/agents/verifier.md`](.cursor/agents/verifier.md) — after SCOPE code. |

There is no `/pitch` skill and no builder swarm. Winning-team names are voices inside those modes, not workers with branches. Any-hackathon axes: [`.cursor/skills/hackathon/references/archetype.md`](.cursor/skills/hackathon/references/archetype.md).
