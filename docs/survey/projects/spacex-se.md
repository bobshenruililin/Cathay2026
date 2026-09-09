---
id: spacex-se
title: SpaceX systems engineering
kind: aviation-bar
url: https://assets.ctfassets.net/c2mtbunjxyfe/576AcANtELHY1qzQXDQBpe/965235c909b093e6612f93780931d913/SpaceX_Systems_Engineering_Handbook.pdf
year: 2012
status: reviewed
well: "Test like you fly; HITL every hardware-software change; iterate vs infinite analysis; no second brain."
poor: "Rockets. Do not cargo-cult avionics."
steal: "pnpm test:demo is HITL. Sim clock not Date.now(). Cut the LLM/Wi-Fi as a talk beat."
never: "A second ranker. Mocking station time with Date.now()."
applied: []
scope_recipe: "Keep e2e/demo.spec.ts sacred — pnpm test:demo"
pitch_recipe: "docs/PITCH_NOTES.md — test like you fly"
later_recipe: ""
---

# SpaceX systems engineering

Public SE handbook + software AMA. Map HITL to the six-step demo, not to a Falcon.
