---
id: hackathon-playbook
status: claimed
claimant: cursor/hackathon-playbook-fe96
globs: README.md, AGENTS.md, .cursor/skills/hackathon/**, .cursor/rules/hackathon.mdc, docs/HACKATHON.md, docs/QUESTIONS.md, docs/claims/hackathon-playbook.md
checker: test -f README.md && test -f .cursor/skills/hackathon/SKILL.md && pnpm typecheck && pnpm test:demo
forbidden: packages/**, apps/**, docs/DEMO.md, e2e/**
---

# README + `/hackathon` mode aliases

Lease for stranger README (claims, compound, briefing, `/hackathon`) and
explicit skill modes. Not a product feature. Not a builder swarm.

Pitch is **not** a new skill: `/hackathon` `apply` (gated clock) + `90s`
(demo click / Nov words). Compound and verifier **delegate** to files that
already exist.
