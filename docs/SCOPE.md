# Scope

In scope for the 16 November 2026 stage demo:

1. `packages/engine` — HKG MCT feasibility, ranking, recovery options, UM / wheelchair / party / downgrade, human-readable `reasoning`.
2. `packages/data` + `packages/sim` — seeded evening bank, station clock, typhoon and CX254 delays.
3. `apps/console` — iPad landscape triage queue, connection panel, action drawer; live sim adapter; LLM draft + flight-number guard.
4. `docs/DEMO.md` + `e2e/demo.spec.ts` — six-step Playwright path (`pnpm test:demo`).
5. `docs/PILOT_PROPOSAL.md` — Altéa PNR feed, HKG FIDS MQTT, Cathay Mobile App push.

Out of scope for this demo: Altéa `PNR_AddMultiElements` writes, production credentials, public FIDS website scraping, holding device tokens.
