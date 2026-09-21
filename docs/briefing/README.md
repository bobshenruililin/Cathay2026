# Teammate briefing

**For AI agents:** this directory is an **orientation layer**, not the product
specification. On conflict, follow the linked canonical file — usually
[`docs/SCOPE.md`](../SCOPE.md), [`docs/DEMO.md`](../DEMO.md), [`AGENTS.md`](../../AGENTS.md),
or [`.cursor/skills/hackathon/SKILL.md`](../../.cursor/skills/hackathon/SKILL.md).
Do not unfreeze SCOPE from anything here. Do not add a seventh demo step.

Internal. Not on the six-step demo path (`pnpm test:demo`).

## Principal review

From this page: [six-step demo](../DEMO.md) · [team](TEAM.md) · [how to build](HOW_TO_WORK.md) · [winning thesis](WINNING.md) · [27 Sep application](../apply-27-sep.md).

[`docs/apply-27-sep.md`](../apply-27-sep.md) is the paste-ready draft. A human pastes it. The co-signer name stays blank. It is not a promise of a result. Speaker deck: [`docs/pitch/DECK.md`](../pitch/DECK.md).

## Start here

| If you are… | Read |
| --- | --- |
| A new human (10 minutes) | [TEAM.md](TEAM.md) → [HOW_TO_WORK.md](HOW_TO_WORK.md) → [WINNING.md](WINNING.md) |
| A Cursor / Cowork agent | [HOW_TO_WORK.md](HOW_TO_WORK.md) (protocol + starter prompt), then SCOPE / DEMO / AGENTS |
| Prepping Q&A or the 90s | [WINNING.md](WINNING.md), then [`docs/competitive/saturday.md`](../competitive/saturday.md) |

Canonical product docs (do not copy into this folder):

- In / out of Saturday: [`docs/SCOPE.md`](../SCOPE.md)
- Six clicks: [`docs/DEMO.md`](../DEMO.md)
- Agent contract: [`AGENTS.md`](../../AGENTS.md)
- Spine / LIVE table: [`docs/HACKATHON.md`](../HACKATHON.md)
- Parked vs open: [`docs/LATER.md`](../LATER.md), [`docs/QUESTIONS.md`](../QUESTIONS.md)

## What is current vs not

| Kind | Meaning | Where |
| --- | --- | --- |
| **Current product** | Shipped for 16 Nov. Six clicks. Engine-true. | SCOPE, DEMO, `packages/*`, `apps/console` |
| **Later idea** | Real, parked. Do not pull into the iPad. | [`docs/LATER.md`](../LATER.md), COMPOUND Next |
| **Open question** | Simplest interpretation already picked; humans can overturn. | [`docs/QUESTIONS.md`](../QUESTIONS.md) |
| **Rejected** | Foil / Never. Do not rebuild. | COMPOUND Never, competitive learnings, WINNING “do not” |

## Competitive intel explorer (same folder, different object)

Merged earlier as a **win-memo site**, not this orientation. Markdown source:
[`docs/competitive/README.md`](../competitive/README.md).

```bash
python3 -m http.server 4173 --directory docs/briefing
```

http://localhost:4173 — Chrome will not load the JSON from `file://`.

- Present: `#slides`, then arrow keys
- PDF: `Reconnect-competitive-intel.pdf` (`pnpm briefing:pdf`)
- CSV: `data/projects.csv` (`pnpm briefing:csv`)
