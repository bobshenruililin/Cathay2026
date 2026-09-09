---
id: amadeus-disruption-agent
title: Amadeus disruption agent
kind: github
url: https://github.com/Thaynabarreiro/amadeus-disruption-agent
year: 2025
status: reviewed
well: "LLM drafts, never decides; mock/live; silent if on-time; EU261 as draft context."
poor: "Passenger SMS, not a transfer desk; no HKG MCT."
steal: "Quiet default when atRisk is false. Policy text as draft context only."
never: "RAG that ranks recovery options."
applied: []
scope_recipe: "apps/console/lib/adapter/sim-adapter.ts keep healthy visible — pnpm test:demo"
pitch_recipe: ""
later_recipe: "docs/LATER.md CX CoC RAG for drafts"
---

# Amadeus disruption agent

Same LLM-last architecture as Reconnect. Steal silence and policy-grounded copy.
