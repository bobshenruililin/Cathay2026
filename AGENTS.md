# Reconnect — agent contract

## What this is
Missed-connection recovery console for HKG transfer agents. Hackathon build. Demo on Nov 16.

## Non-negotiables
- packages/engine has ZERO runtime dependencies and ZERO LLM calls. Pure functions. 100% covered.
- Every engine output includes a `reasoning: string[]` field. UI displays it verbatim.
- LLM is used ONLY in apps/console/lib/llm/* for: message drafting, summarisation. Never for decisions.
- Demo path (docs/DEMO.md) is sacred. Any change must keep `pnpm test:demo` green.
- Deterministic sim: same seed → same output. Always.

## Workflow
- Small commits, conventional messages. Never force-push. Never touch main directly; PRs only.
- Before claiming done: `pnpm typecheck && pnpm test && pnpm test:demo`. Paste the output.
- If a task is ambiguous, write the question to docs/QUESTIONS.md and pick the simplest interpretation. Don't block.
- Do not add features not in docs/SCOPE.md. If tempted, add to docs/LATER.md.
- Compounding: when the user says compound, nudge, steal from, ingest, or refresh survey, read `.cursor/skills/compound/SKILL.md` first. Every PR appends one line to `docs/compound/log.md` or moves one `docs/COMPOUND.md` Next → Done. Do not implement LATER/Never product features.

## Style
- No clever abstractions. Three similar lines > one premature helper.
- shadcn components only. No new UI libs.
- Every new file ≤ 200 lines or split it.
