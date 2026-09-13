---
id: hackathon-skill
status: claimed
claimant: cursor/hackathon-skill-316e
globs: .cursor/skills/hackathon/**, .cursor/rules/hackathon.mdc, AGENTS.md, docs/HACKATHON.md, docs/SCOPE.md, docs/QUESTIONS.md, docs/claims/hackathon-skill.md
checker: test -f .cursor/skills/hackathon/SKILL.md && test -f docs/HACKATHON.md && pnpm typecheck && pnpm test && pnpm test:demo
forbidden: packages/**, apps/**, docs/DEMO.md, e2e/**
---

# Cathay-tuned `/hackathon` skill

Lease for the freeze/apply skill. Not a product feature. Not a builder swarm.

## Checker

Files exist; demo path untouched (`pnpm test:demo` green). Paste output when `done`.
