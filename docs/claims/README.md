# Claims

A claim is a markdown file in this folder. It is a lease on a file glob, not a
framework.

## Fields

- `id` — stable slug
- `status` — `open` | `claimed` | `done`
- `claimant` — agent or person holding the lease
- `globs` — paths this claim may edit
- `checker` — command that must pass before `done`
- `forbidden` — paths this claim must not touch

## Rules

1. Claim by setting `status: claimed` in the same commit as the first code touch.
2. One writer per glob. If two open claims share a glob, they are a **queue**.
3. Engine claims all share `packages/engine/**` — hold only one at a time.
4. Mark `done` only after the checker is green; paste the output in the file.
5. The verifier subagent never claims product work.
6. Subagents collaborate with the contract (tests, fixtures, `AGENTS.md`), not
   with each other.
