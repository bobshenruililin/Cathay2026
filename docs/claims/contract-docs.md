---
id: contract-docs
status: done
claimant: cursor/engine-hardening-7018
globs: docs/**, AGENTS.md
checker: test -f docs/SCOPE.md && test -f docs/LATER.md && test -f docs/claims/README.md
forbidden: packages/**, apps/**
---

# Contract docs + claim board

Write SCOPE, LATER, QUESTIONS SSR/party notes, AGENTS.md claims bullet, and this
folder.

## Checker

```
CONTRACT_DOCS_OK
```
