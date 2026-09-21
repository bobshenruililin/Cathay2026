# Technique catalog

Legal rewrites only. Walls: [docs/engine/SPACE.md](../../../../docs/engine/SPACE.md).
Each row is one technique, the kernel it may touch, and what must stay identical.
The bench is the referee. A row is not a license to ship an unmeasured edit.

| Technique | Kernel | Must stay identical |
| --- | --- | --- |
| emit-late reasoning | `generateOptions` | exact `reasoning[]` on the 0–3 returned options; rank uses the score formula only |
| linear select | `generateOptions` | same winner as sort-by-score then flight number; `referenceOptions` deep-equals |
| hoist invariant minutes | `generateOptions` | one inbound arrival, one outbound departure, one extra-transit addend per connection; same minute counts as `minutesBetween` and `requiredMinutesFor` |
| hoist invariant minutes | `triageConnection` | one slack, one required, one status; same `atRisk`, notes, and `reasoning[]` |
| avoid repeated ISO parse/string build on losers | `generateOptions` | losers stay losers; day equality matches `hkgCalendarDay`; epochs match `Date.parse` |
| early-exit seat and party checks | `generateOptions` | accept iff `partySeating` is defined; UM, wheelchair, party size, and MCT rules unchanged |

Already measured on this branch before the campaign gate: emit-late reasoning and linear select (`8653cf3`). Further rows need a disjoint range against `bench/baseline.ts` or they revert.

Do not import a new algorithm to fill a row. Tables, ranking, and minute arithmetic already in this engine are the whole hull.
