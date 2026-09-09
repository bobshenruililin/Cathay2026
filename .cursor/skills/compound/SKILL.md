---
name: compound
description: >-
  Compound Reconnect from the git survey database. Use when the user says
  compound, nudge the database, steal from a project, ingest a GitHub or
  press URL, refresh a survey card, or list the database. Always apply one
  small legal change via the ladder. Never implement LATER or Never product
  features (Kafka, Gurobi, passenger chatbot, LLM ranking, OpenMCT embed).
---

# Compound

Read this skill before touching `docs/survey/`, `docs/COMPOUND.md`, or
`docs/compound/log.md`. Database: `docs/survey/projects/<id>.md`. Board:
`docs/COMPOUND.md`. Log: `docs/compound/log.md`.

## Modes

| Mode | Trigger | Action |
| --- | --- | --- |
| list | list the database | Print `docs/survey/index.md`, unapplied `steal` first |
| ingest | ingest URL / repo | New card + index row, then apply ladder on that card |
| steal | compound from X | Fuzzy-match `id` or `title`, apply ladder |
| nudge | nudge / compound (no id) | Highest-value unapplied steal: SCOPE, then test, then PITCH |
| refresh | refresh X | Re-fetch public README/press, fill gaps, then apply ladder |

Default mode is **nudge**. One nudge = one card + one apply.

## Card schema

YAML frontmatter, then a short body. File ≤80 lines. Required keys:

`id`, `title`, `kind` (`cathay-winner` \| `similar-hackathon` \| `github` \|
`aviation-bar` \| `anti-pattern`), `url`, `year`, `status` (`seed` \|
`reviewed` \| `stale`), `well`, `poor`, `steal`, `never`, `applied` (string
array), `scope_recipe`, `pitch_recipe`, `later_recipe`.

`scope_recipe` is `path — checker` or empty. Never copy code from `url`.

After creating a card, add one row to `docs/survey/index.md`.

## Apply ladder

Exactly **one** product-touching change, then the mandatory log line.

1. Unapplied `scope_recipe` on the card that is in `docs/SCOPE.md`.
2. Else unapplied COMPOUND Next tagged SCOPE that cites this `id`.
3. Else a characterizing test/fixture that locks the steal (guard string,
   engine `dependencies: {}`, no new product behavior).
4. Else a PITCH docs change (`docs/PITCH_NOTES.md` or sim-derived
   `docs/METRICS.md`).
5. Else (anti-pattern, or only LATER left): **do not build the LATER
   feature**. Add or tighten a Never test, refresh the card, log why.

If the chosen Next is already Done, pick the next unapplied steal. Do not
batch three features into one nudge.

## Hard stops (abort apply; card refresh still allowed)

- COMPOUND **Never**, or **LATER** as a product feature
- Seventh DEMO step, or mocking `Date.now()`
- Engine public API change; LLM import in `packages/engine`
- New UI library; any new file >200 lines (cards >80)
- Copying surveyed source
- If `docs/claims/` exists and the glob is `claimed` by someone else

Engine edits require a claim when that board exists. Engine claims are a queue.

## After apply

1. Append `docs/compound/log.md`:
   `YYYY-MM-DD | <id> | <lesson> | <path> | SCOPE\|PITCH\|LATER\|Never`
2. Push the steal slug onto the card `applied:` list.
3. If a COMPOUND Next closed, move it to Done (paste checker).
4. Next board stays ≤12; overflow → `docs/LATER.md`.
5. Never shrink Never without a `docs/QUESTIONS.md` note.
6. Run the recipe checker. Console/demo → `pnpm test:demo` as well.

## Nudge copy

`Compound from flylab-2025` · `Ingest https://github.com/...` · `Nudge the database`
