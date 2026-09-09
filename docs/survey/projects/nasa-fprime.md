---
id: nasa-fprime
title: NASA F Prime
kind: aviation-bar
url: https://github.com/nasa/fprime
year: 2024
status: reviewed
well: "Components depend on typed ports, not on sibling internals; sim adapters swap."
poor: "C++ flight software framework. Do not add FPP."
steal: "Console and sim import engine public types only."
never: "Embed F Prime. Cross-import engine src internals."
applied: []
scope_recipe: ""
pitch_recipe: ""
later_recipe: ""
---

# NASA F Prime

Flies on Ingenuity. The steal is the port rule, already how `packages/engine` exports.
