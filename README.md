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

- Agent contract: `AGENTS.md`
- Demo path: `docs/DEMO.md`
- Interpretations: `docs/QUESTIONS.md`
- Pilot (Altéa PNR, FIDS MQTT, Cathay App push): `docs/PILOT_PROPOSAL.md`
- Scope: `docs/SCOPE.md`
