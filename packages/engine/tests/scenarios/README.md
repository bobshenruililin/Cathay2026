# JSON scenario fixtures

Each file is one gate-desk story. Fields:

- `id`, `title`, `story`, `tags`
- `passenger` — engine `Passenger` (optional `um`, `wheelchair`, `ssr`, `partyId`, `partySize`)
- `inbound` / `outbound` / `pool[]` — compact flights (`flightNumber`, `airline`, optional `origin`, `destination`, `depart`, `arrive`, `seats`, `delayMinutes`)
- `expected.status`, `expected.atRisk`, `expected.optionFlightNumbers`
- optional `expected.feasible`, `expected.triageReasoningIncludes`, `expected.optionReasoningIncludes`

Omitted seat maps default to a full cabin. Omitted origins/destinations are TPE→HKG inbound and HKG→LHR outbound.
