# Open questions (simplest interpretations)

## Connection feasibility

Feasible iff `(outbound actual departure − inbound actual arrival) >= HKG MCT +
gate walk buffer + passenger buffers`. MCT comes only from `src/mct.ts`
(`HKG_MCT_MINUTES`). Wheelchair (+15 min) and UM escort (+20 min) are additive.
They do not rewrite the MCT table.

Tight: slack ≥ required and slack < required + 20. Missed: slack < required.
At-risk = tight or missed. HKG only.

## Unaccompanied minors / wheelchair / party / downgrade

- UM recovery stays on CX metal (staff escort). Partner flights are not offered.
- Whole party (`partySize`, default 1) must fit on one flight in one cabin.
- If the booked cabin is exhausted, downgrade protection holds the next lower
  cabin with enough seats and states that in `reasoning`.

## Ranking

`score = (tierStatus * 3) + (seatMatch * 2) - (delayMinutes / 10)`.

Seat match is 1 when the booked cabin still has seats for the whole party.

## Console

Live path is `packages/sim` (`NEXT_PUBLIC_CONSOLE_ADAPTER` unset). Mock adapter
remains a seam (`=mock`). LLM drafting is `lib/llm/draft.ts` plus
`POST /api/draft`. Flight-number guard falls back to the Cathay Alert template.
The action column is a persistent right-hand drawer (iPad landscape, min 1024px).
