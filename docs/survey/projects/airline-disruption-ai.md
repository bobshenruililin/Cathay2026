---
id: airline-disruption-ai
title: Kafka IROPS clone
kind: anti-pattern
url: https://github.com/MahimaAdvilkar/airline-disruption-ai
year: 2025
status: reviewed
well: "Named event schemas (flight_ops.events.v1) — PILOT already names boring feeds."
poor: "Kafka, ksqlDB, Vertex Gemini recommendations, Mapbox, cohort APIs."
steal: "Keep PILOT feed names boring. Lock engine runtime deps at {}."
never: "Kafka, Mapbox, Gemini-in-the-cockpit, six-agent story."
applied: [engine-purity-test]
scope_recipe: ""
pitch_recipe: ""
later_recipe: ""
---

# Kafka IROPS clone

The 30-team super-app. Characterizing test: `packages/engine` dependencies stay `{}`.
