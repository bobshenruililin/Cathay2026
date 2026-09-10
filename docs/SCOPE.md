# Scope

In scope for the 16 November 2026 stage demo:

1. `packages/engine` — HKG MCT feasibility, ranking, recovery options, UM / wheelchair / party / downgrade / SSR, human-readable `reasoning`. Additive passenger fields: `um`, `wheelchair`, `ssr`, `partyId`, `partySize`. Gate-desk stories: `packages/engine/tests/scenarios/` (JSON 01–40).
2. `packages/data` + `packages/sim` — seeded evening bank, station clock, typhoon and CX254 delays.
3. `apps/console` — iPad landscape triage queue, connection panel, action drawer; live sim adapter; LLM draft + flight-number guard.
4. `docs/DEMO.md` + `e2e/demo.spec.ts` — six-step Playwright path (`pnpm test:demo`).
5. `docs/PILOT_PROPOSAL.md` — Altéa PNR feed, HKG FIDS MQTT, Cathay Mobile App push.
6. `docs/claims/` — markdown leases so agents do not edit the same glob at once.

Out of scope for this demo: Altéa `PNR_AddMultiElements` writes, production credentials, public FIDS website scraping, holding device tokens. See `docs/LATER.md`.

Improvement OS (not a demo feature): `docs/COMPOUND.md`, `docs/survey/`, `.cursor/skills/compound/SKILL.md`.
