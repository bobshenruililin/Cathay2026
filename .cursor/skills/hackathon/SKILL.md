---
name: hackathon
description: >-
  Freeze, apply, and aliases for this host and any hackathon. Use when the
  user says /hackathon, /auto-hackathon, freeze, stop-coding, 27 Sep
  application, recon, apply, identity, claims, 90s, pitch, demo, compound,
  verifier, anti-swarm, or spawn a swarm. Pitch is apply + 90s, not a new
  skill. Never a builder swarm.
---

# /hackathon

Read this skill before adding a feature, spawning agents, or drafting the
application. This host is **Reconnect**. Feature Zero is already shipped
(`docs/DEMO.md`, `pnpm test:demo`). Remaining sport: **apply**, then **freeze**.

Spine (mirror, do not fork): `docs/HACKATHON.md` → `docs/DEMO.md` +
`docs/SCOPE.md` + `docs/PITCH_NOTES.md`.

References: `references/events.md` (Cathay prior), `references/archetype.md`
(any event), `references/distinctive.md`, `references/companions.md`.
Fixture: `examples/reconnect-cathay/`.

## Clock × invocation

| Phase | Legal | Illegal |
| --- | --- | --- |
| Now → 27 Sep | `/auto-hackathon` `apply` (+ `recon`) | Engine PRs as padding |
| Oct Master Classes + initial submit | `/auto-hackathon` `recon` | New prize path; rebuild |
| 14–16 Nov | `/hackathon` `stop` `identity` `claims` `90s` | `/auto-hackathon` |
| Any “let’s add” | `stop` first | `/swarm`, `/orchestrate` |

One session is **one column**. Mixing recon into freeze is how you lose.
**Pitch** is not a package: gated clock → `apply`; freeze/demo words → `90s`.

## Modes

| Invoke | Mode | Does | Must not |
| --- | --- | --- | --- |
| `/auto-hackathon` | `recon` | T+0 rules. Refresh `events.md` as a **prior**. | Code the host. Reopen the problem. |
| `/auto-hackathon` | `apply` | Gate application **is** the product. Prize math. Named owner. Pitch copy before the sprint. | A second spine. Engine PRs. `/pitch` kit. |
| `/hackathon` | `identity` | Hallway noun. Sameness kill if “AI / agent / dashboard”. | Invent a problem. Super-app. |
| `/hackathon` | `stop` | **Delete** adds. Stop-coding when the path works. | Swarm. Second object. |
| `/hackathon` | `claims` | LIVE line has a path or the checkpoint **fails**. Glob lease before writes. | Pitch-deck paths. Vendor ROI. |
| `/hackathon` | `90s` | Working click + word budget. Two pitches, one object. Demo path. | Seventh DEMO step. New `/demo` skill. |
| (alias) | `pitch` | Route: `apply` if before the sprint; else `90s`. | A third skill named pitch. |
| (delegate) | `compound` | Follow `.cursor/skills/compound/SKILL.md`. One legal steal. | Freeze sitting. LATER/Never product. |
| (delegate) | `verifier` | Follow `.cursor/agents/verifier.md`. Readonly. | Claim product globs. Unfreeze. |

Only a **human** unfreezes (`docs/SCOPE.md` + `docs/QUESTIONS.md`). Later
modes **cut**. They never replace the problem.

## Pick a mode

1. If the user named a mode, run that one, then stop.
2. Else if they asked to add / swarm / build more: `stop`.
3. Else if they said pitch / application and it is before the sprint: `apply`.
4. Else if they said pitch / demo / 90s / Saturday script: `90s`.
5. Else if they said compound / nudge / steal / ingest / refresh survey: `compound`.
6. Else if they said verify / verifier / is it done: `verifier`.
7. Else if they want current rules / Master Class leak: `recon`.
8. Else freeze sequence: `stop` → `identity` → `claims` → `90s`. Then human.

Do not run the sequence and then start coding.

## Procedures

### recon

1. Read `references/archetype.md`, then `references/events.md` (prior, not gospel).
2. Fetch T+0 from the official site. Note diffs. Unknowns stay unknown.
3. Update `events.md` only if the public page changed. Never rewrite the spine.
4. Output: what leaked, what is unknown, what must not change. No `packages/**`.

### apply

1. Read `docs/HACKATHON.md`, `docs/PITCH_NOTES.md`, `docs/PILOT_PROPOSAL.md`,
   `docs/competitive/judging-2026.md`.
2. Named owner / BU in sentence one. Sameness kill on “AI / agent / dashboard”.
3. Prize math: one **primary** + one **piggyback** on the **same** path.
4. Output: draft sections + prize math + gaps. Not a PR to `packages/**`.

### identity

1. Read `references/distinctive.md`. First noun must be the object, not the model.
2. If the noun is “AI / agent / dashboard”: rewrite. No code.
3. Beat that event’s `median_loser`. Engine-true; copy last.

### stop

1. If Feature Zero works, do not add. On this host: typhoon button is the object.
2. Delete the proposed add. If this session’s diff **is** that add, revert it.
3. Real later product → `docs/LATER.md` only. Refuse `/swarm` / champion workers.
4. Output: what was deleted and why. Then stop.

### claims

1. If you will write: take a `docs/claims/` lease first (one writer per glob;
   engine is a queue). Verifier never claims product work.
2. Audit every LIVE row in `docs/HACKATHON.md` against the tree.
3. Spoken LIVE with no path → checkpoint **fails**. SEEDED labeled (`SIM`).
4. Numbers only from `packages/sim` / `docs/METRICS.md`. No vendor ROI.

### 90s

1. Read `docs/DEMO.md` + `docs/competitive/saturday.md`. Same six steps.
2. Click: clock + queue → typhoon → CX254 +180 → `reasoning[]` → guarded
   draft → Approve.
3. Two live pitches (15 Nov, 16 Nov), one object. Word budget. Fallback tape.
4. **SIM** / offline draft is a talk beat, not step 7. No architecture tour.

### pitch

Not a skill. If gated clock (apply season): run **`apply`**. If freeze /
demo rehearsal: run **`90s`**. Then stop. Do not invent `/pitch`.

### compound

Read `.cursor/skills/compound/SKILL.md` and run **one** of its modes.
Refuse 14–16 Nov (looks like recon-rebuild). Do not mix with freeze
in one sitting. Do not implement LATER/Never product features.

### verifier

Readonly. Follow `.cursor/agents/verifier.md`. After SCOPE code, not a
winner seat. Prefer `pnpm typecheck && pnpm test:demo`. `pnpm test` may
already be red in `packages/engine` on `main` — do not “fix” engine from here.

## After a mode

Print: mode, decision (cut / fail / pass), next legal mode, human still
frozen. Shape: `examples/reconnect-cathay/checkpoint.md`.

Do not implement unless the human already unfroze a SCOPE glob **and** you
hold `docs/claims/`. Engine is a queue.

After any product-adjacent code:
`pnpm typecheck && pnpm test && pnpm test:demo`.

## Hard stops

- Unfreeze SCOPE; seventh DEMO step; LLM in `packages/engine`; passenger `/chat`
- Mix `/auto-hackathon` into the freeze weekend; use `stop` as cover to rebuild
- Builder swarm / champion branches / `/pitch` or `/demo` skill packages
- Copy last year’s trophy; promise a win; slide factory; auto-submit
- Touch `packages/engine` from this skill

## Voices (not workers)

Named winning teams are **accents inside modes**. They do not get branches.
On this host: `stop` GingTrip; `identity` U-Explore + FlyLab; `apply`/`recon`/
`claims` NAAR; `90s` click TouchCX; `90s` clock Cathay Green. Foils
(Fight4Flight, FlyMate, SMASH) fire the **same** modes on drift.
