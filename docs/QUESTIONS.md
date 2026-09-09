# Open questions (simplest interpretations)

Engine work started without `docs/SCOPE.md` or `docs/DEMO.md`. These are the
calls made so the build is not blocked.

## `pnpm test:demo`

`AGENTS.md` requires `pnpm test:demo` before claiming done. There is no demo
path, Playwright suite, or `docs/DEMO.md` yet, so the script is omitted rather
than faked. Stop condition for this change is `pnpm --filter engine test` at
100% statement coverage.

## Scope file missing

`docs/SCOPE.md` does not exist. This package implements only the engine
deliverables (types, MCT feasibility, option generation, ranking, reasoning,
tests). Console UI, LLM drafting, and the 6-step demo are out of scope here.

## Connection feasibility

Feasible iff `(outbound actual departure − inbound actual arrival) >= HKG MCT +
gate walk buffer`. Times are ISO-8601 instants. MCT comes only from `src/mct.ts`.

Tight: slack ≥ MCT+buffer and slack < MCT+buffer+20. Missed: slack < MCT+buffer.
At-risk = tight or missed. HKG only.

## Ranking

`score = (tierStatus * 3) + (seatMatch * 2) - (delayMinutes / 10)`.

Tier map: Diamond=4, Gold=3, Silver=2, Green=1. Seat match is 1 when the
alternative still has seats in the passenger’s booked cabin. Delay is minutes
from the original outbound actual departure to the alternative actual departure.

## Same-day / next CX / partner

Same-day uses the Asia/Hong_Kong calendar date (UTC+8, no DST) of the original
outbound. Next CX is the earliest CX departing after the original outbound that
was not already chosen as same-day. Partner is the best-scoring oneworld non-CX
flight not already chosen. At most one from each bucket, then sorted by score
and flight number.
