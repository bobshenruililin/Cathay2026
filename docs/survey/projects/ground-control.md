---
id: ground-control
title: Ground Control
kind: github
url: https://github.com/joaquin03/ground-control
year: 2025
status: reviewed
well: "Rule spine HANDLE/ESCALATE/DROP; human approval; golden emails including injection."
poor: "Charter trip-support inbox, not HKG transfer."
steal: "Adversarial draft fixtures next to the flight-number guard."
never: "LLM decides HANDLE vs DROP."
applied: [adversarial-guard]
scope_recipe: "apps/console/lib/llm/guard.ts + guard.test.ts — pnpm --filter console test"
pitch_recipe: ""
later_recipe: ""
---

# Ground Control

Trust-before-content. 29 golden emails, including prompt injection.

## Vs Reconnect

We already drop hallucinated flight numbers. Injection without a fake
flight used to pass the guard. That is the gap this card closed.

## Apply

SCOPE: table-driven attacks on `applyFlightNumberGuard` (invented flights,
empty body, instruction-override). Do not add a second decision model.
