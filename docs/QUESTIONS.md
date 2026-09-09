# Open questions (simplest interpretations)

Engine, sim, and console landed on separate PRs. These are the calls that keep
the combined tree consistent.

## Connection feasibility

Feasible iff `(outbound actual departure − inbound actual arrival) >= HKG MCT +
gate walk buffer + passenger buffers`. Times are ISO-8601 instants. MCT comes
only from `packages/engine/src/mct.ts` (`HKG_MCT_MINUTES`). Wheelchair (+15 min)
and UM escort (+20 min) are additive. They do not rewrite the MCT table.

Tight: slack ≥ required and slack < required + 20. Missed: slack < required.
At-risk = tight or missed. HKG only.

## Unaccompanied minors / wheelchair / party / downgrade

- UM recovery stays on CX metal (staff escort). Partner flights are not offered.
- Whole party (`partySize`, default 1) must fit on one flight in one cabin.
- If the booked cabin is exhausted, downgrade protection holds the next lower
  cabin with enough seats and states that in `reasoning`.

## Ranking

`score = (tierStatus * 3) + (seatMatch * 2) - (delayMinutes / 10)`.

Tier map: Diamond=4, Gold=3, Silver=2, Green=1. Seat match is 1 when the
alternative still has seats in the passenger’s booked cabin for the whole party.
Delay is minutes from the original outbound actual departure to the alternative
actual departure.

## Same-day / next CX / partner

Same-day uses the Asia/Hong_Kong calendar date (UTC+8, no DST) of the original
outbound. Next CX is the earliest CX departing after the original outbound that
was not already chosen as same-day. Partner is the best-scoring oneworld non-CX
flight not already chosen. At most one from each bucket, then sorted by score
and flight number.

## Console

Live path is `packages/sim` (`NEXT_PUBLIC_CONSOLE_ADAPTER` unset). Mock adapter
(`lib/adapter/mock-adapter.ts`) remains a seam (`=mock`) and uses the same
typhoon / CX254 delay constants as `packages/sim`. LLM drafting is
`lib/llm/draft.ts` plus `POST /api/draft`. Flight-number guard falls back to the
Cathay Alert template. The action column is a persistent right-hand drawer
(iPad landscape, min 1024px).

## MAXCT / overnight

If an option lands on the next calendar day, reasoning must call it overnight
(`Overnight option (next calendar day)` in `option-reason.ts`). Unaccompanied
minors are not offered next-calendar-day flights. Do not rip UM-on-CX-metal
or downgrade protection to match an older plan.

## Verification

`docs/DEMO.md` is sacred. Claim done only after `pnpm typecheck`, `pnpm test`,
and `pnpm test:demo`. Engine coverage stays 100% on `packages/engine/src/**`.
