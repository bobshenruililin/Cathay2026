---
name: hackathon
description: >-
  Cathay Hackathon 2026 freeze and apply. Use when the user says /hackathon,
  /auto-hackathon, freeze, stop-coding, should we still be coding, 27 Sep
  application, recon, apply, identity, claims, 90s pitch, anti-swarm, or
  spawn a swarm. Corporate bonus-stake × gated-then-sprint. Deletes work
  when agents want to add it. Never a builder swarm. Never HackMIT/RoomPulse
  24h occupancy-vs-booking.
---

# /hackathon

Read this skill before adding a feature, spawning agents, or drafting the
27 Sep application. This host is **Reconnect**. Feature Zero is already
shipped (`docs/DEMO.md`, `pnpm test:demo`). Remaining sport: **apply**,
then **freeze**.

Spine (mirror, do not fork): `docs/HACKATHON.md` → `docs/DEMO.md` +
`docs/SCOPE.md` + `docs/PITCH_NOTES.md`.

References: `references/events.md` (prior), `references/distinctive.md`
(hallway), `references/companions.md` (do not bolt on). Fixture shape:
`examples/reconnect-cathay/`.

## Clock × invocation

| Phase | Legal | Illegal |
| --- | --- | --- |
| Now → 27 Sep | `/auto-hackathon` `apply` (+ `recon` priors) | Engine PRs as padding |
| Oct Master Classes + initial submit | `/auto-hackathon` `recon` | New prize path; rebuild |
| 14–16 Nov | `/hackathon` `stop` `identity` `claims` `90s` | `/auto-hackathon` |
| Any “let’s add” | `stop` first | `/swarm`, `/orchestrate` |

One session is **one column**. Mixing recon into freeze is how you lose.

## Modes

| Invoke | Mode | Does | Must not |
| --- | --- | --- | --- |
| `/auto-hackathon` | `recon` | T+0 rules. Refresh `events.md` as a **prior**. | Code Reconnect. Reopen the problem. |
| `/auto-hackathon` | `apply` | 27 Sep application **is** the product. Prize math. Named owner. | A second spine. Engine PRs. |
| `/hackathon` | `identity` | Hallway noun. Sameness kill if “AI / agent / dashboard”. | Invent a problem. Super-app. |
| `/hackathon` | `stop` | **Delete** adds. Stop-coding when the path works. | Swarm. Second object. |
| `/hackathon` | `claims` | Every LIVE line has a path or the checkpoint **fails**. | Pitch-deck paths. Vendor ROI. |
| `/hackathon` | `90s` | Working click + word budget. Two pitches, one object. | Seventh DEMO step. |

Only a **human** unfreezes (`docs/SCOPE.md` + `docs/QUESTIONS.md`). Later
modes **cut**. They never replace the problem.

## Pick a mode

1. If the user named a mode, run that one, then stop.
2. Else if they asked to add / swarm / build more: `stop`.
3. Else if before 14 Nov and they want the application: `apply`.
4. Else if they want current rules / Master Class leak: `recon`.
5. Else freeze sequence: `stop` → `identity` → `claims` → `90s`. Then human.

Do not run the sequence and then start coding.

## Procedures

### recon

1. Read `references/events.md`. It is a **prior**, not gospel.
2. Fetch T+0 from the official site and the HKSYU page. Note diffs.
3. Update `events.md` only if the public page changed. Never rewrite the spine.
4. Output: what leaked, what is unknown, what must not change.
5. Stop. No `packages/**` writes.

### apply

1. Read `docs/HACKATHON.md`, `docs/PITCH_NOTES.md`, `docs/PILOT_PROPOSAL.md`,
   `docs/competitive/judging-2026.md`.
2. Named BU in sentence one: Airport Systems / HKG Transfer.
3. Prize math: one **primary** (2026 desk owner) + one **piggyback**
   (Innovate intern) on the **same** 30-day pilot.
4. Copy sells a 2026 owner, not a student toy. Do not pad with engine PRs.
5. Output: draft sections + prize math + gaps. Not a PR to `packages/**`.

### identity

1. Read `references/distinctive.md`.
2. First noun a stranger uses must be the desk or the typhoon button.
3. If the noun is “AI / agent / dashboard”: rewrite. No code.
4. Beat `median_loser`. Pairing sentence: transfer agent + Airport Systems.
5. Engine decides what is true; copy decides how to say it.

### stop

1. If the six-step path works, do not add. The typhoon button is the object.
2. Delete the proposed add from the plan. If this session’s diff **is** that
   add, revert it. Do not revert unrelated claims.
3. Temptation that is a real later product → `docs/LATER.md` only. Do not build it.
4. Refuse `/swarm`, `/orchestrate`, champion-named workers with feature branches.
5. Output: what was deleted and why. Then stop.

### claims

1. Audit every LIVE row in `docs/HACKATHON.md` against the tree.
2. Spoken LIVE with no path → checkpoint **fails**. Do not “fix it in the deck”.
3. SEEDED must be labeled (`SIM`). Numbers only from `packages/sim` /
   `docs/METRICS.md`.
4. No ConnectGuard €25M, no SWISS minutes, no vendor ROI.

### 90s

1. Read `docs/competitive/saturday.md`. Same six steps as `docs/DEMO.md`.
2. Click: clock + queue → typhoon → CX254 +180 → `reasoning[]` → guarded
   draft → Approve.
3. Two live pitches (15 Nov, 16 Nov), one object. Word budget. Fallback tape.
4. **SIM** badge / offline draft is a talk beat, not step 7.
5. Fail if they want a seventh step or an architecture tour.

## After a mode

Print: mode, decision (cut / fail / pass), next legal mode, human still
frozen. Shape: `examples/reconnect-cathay/checkpoint.md`.

Do not implement unless the human already unfroze a SCOPE glob **and** you
hold `docs/claims/`. Engine is a queue.

After any product-adjacent code:
`pnpm typecheck && pnpm test && pnpm test:demo`.

## Hard stops

- Unfreeze SCOPE; seventh DEMO step; LLM in `packages/engine`; passenger `/chat`
- Mix `/auto-hackathon` into 14–16 Nov; use `stop` as cover to rebuild
- Builder swarm / nine champion branches / FlightFixer-the-orchestrator
- Copy last year’s trophy (cargo CV, robot, green currency, HX trolley)
- Promise a win; slide factory; auto-submit
- Touch `packages/engine` from this skill

## Voices (not workers)

Named Cathay teams are **accents inside modes**. They do not get branches.

| Mode | Accent |
| --- | --- |
| `stop` | GingTrip: one object; delete adds |
| `identity` | U-Explore sameness-kill; FlyLab who-scores |
| `apply` `recon` `claims` | NAAR: named BU, honest numbers |
| `90s` click | TouchCX: the iPad is the demo |
| `90s` clock | Cathay Green: two pitches, one spine |

Foils (Fight4Flight, FlyMate, SMASH) fire the **same** modes on drift.

## Compound vs this skill

`.cursor/skills/compound/` is a different OS: one legal steal. It is not
`recon` during freeze. Do not run both in one sitting.
