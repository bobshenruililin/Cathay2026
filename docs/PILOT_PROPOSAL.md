# Reconnect HKG transfer-desk pilot — technical proposal

**To:** Cathay Pacific Information Technology — Airport Systems, Passenger Service Systems, and Digital channels  
**From:** Reconnect (HKG missed-connection recovery console)  
**Subject:** Controlled HKG transfer-desk pilot — Altéa PNR, FIDS MQTT, and Cathay App push  
**Classification:** Internal — IT directors  
**Demo:** 16 November 2026 (Reconnect stage path in `docs/DEMO.md`)

## 1. Purpose

Reconnect is a gate-agent console for HKG missed-connection recovery. The engine is deterministic TypeScript with no runtime dependencies and no LLM in the decision path. The LLM is used only to draft passenger messages, and those drafts are flight-number-guarded before send.

This note specifies the three production integration points required for a 30-day HKG T1 transfer-desk pilot:

1. Amadeus Altéa Reservation / DCS PNR feed (system of record for itinerary, cabin, UM, WCH, party).
2. HKG Flight Information Display System (FIDS) via MQTT (system of record for STD/ETD/gate/status).
3. Cathay Mobile App push notification endpoint (customer channel after agent approval).

No Altéa write is proposed for week 1 of the pilot. Rebooking writes stay in Reconnect’s audit log until PSS change-management signs off `PNR_AddMultiElements`.

## 1.1 Position relative to Passenger Recovery

Cathay already operates a typhoon disruption stack: Amadeus Passenger Recovery for mass reaccommodation (public figure: about 8,000 passengers in 40 minutes), Accenture Rebooking Experience (customer self-rebook chatbots), and 15below customer communication (Rogers / Ling, Airport Industry Review, 2019). This pilot does not replace those systems.

Reconnect is the HKG T1 transfer-desk layer for the last 90 minutes: MCT plus walk, UM, wheelchair, unsplittable party, and agent-visible `reasoning[]`. Mass IROPS remains Passenger Recovery. Week 1 is Altéa **read**, FIDS MQTT, and CANS push after human confirm. `RECONNECT_PILOT=off` returns the desk to Altéa cryptic / Q77.

## 2. Architecture (pilot)

```
Altéa PNR (SOAP 4.0) ──► Reconnect ingest ──► packages/engine (triage + options)
HKG FIDS MQTT ─────────► Reconnect ingest ─┘
Agent iPad (apps/console) ──approve──► Cathay App push API
                              └── audit log (PNR, option, message, actor, sim/prod clock)
```

Clock: production uses HKG station time from FIDS `eventTime` (Asia/Hong_Kong, no DST). The demo path uses `packages/sim` and must not mock `Date.now()`.

## 3. Integration A — Amadeus Altéa PNR feed

### 3.1 Service and endpoint

| Item | Pilot value |
| --- | --- |
| Product | Amadeus Altéa Reservation (1A) + Altéa DCS Customer Management |
| Transport | SOAP 1.1 over TLS 1.2+, WS-Security UsernameToken + SOAP-Header `Session` / `TransactionStatusCode` |
| Endpoint (UAT) | `https://nodeD1.test.webservices.amadeus.com/1ASIWCXCX` |
| Endpoint (PROD) | `https://nodeD1.production.webservices.amadeus.com/1ASIWCXCX` |
| SOAPAction / WSDL | Amadeus Web Services 4.0, office ID `HKGCX08AA` (HKG transfer desk) |
| WSAP | `CX/HKG/1ASIWCXCX` |

Office ID, WSAP, and originator (`CX`) are confirmed with Cathay PSS. Do not point UAT traffic at PROD.

### 3.2 Operations used in the pilot

| Operation | Verb | Purpose in Reconnect |
| --- | --- | --- |
| `PNR_Retrieve` | `PNR_Retrieve/3.0` | Pull live PNR by record locator after FIDS marks inbound delay / at-risk. |
| `PNR_AddMultiElements` | `PNR_AddMultiElements/14.2` (read preview in week 1; write gated) | Preview of protected segment + SSR. Week 2+ write after CAB. |
| `Queue_List` / `Queue_PlacePNR` | `Queue_List/1.0`, `Queue_PlacePNR/1.0` | HKG transfer queue `Q77/C0` (missed connection). |
| `Ticket_ProcessEDoc` | display only | Validate coupon status before offering a recovery flight. |
| DCS `PaxList` | Altéa DCS `GetPassengerList` for inbound flight/date | UM (`UMNR`), WCH (`WCHR`/`WCHS`/`WCHC`), group count, booked cabin. |

### 3.3 PNR retrieve contract (inbound)

`PNR_Retrieve` body (pilot):

```xml
<PNR_Retrieve>
  <retrievalFacts>
    <retrieveByRecLoc>
      <reservation>
        <controlNumber>ABC123</controlNumber>
      </reservation>
    </retrieveByRecLoc>
  </retrievalFacts>
</PNR_Retrieve>
```

Reconnect maps Altéa elements as follows (no inference from free text except SSR codes):

| Altéa source | Reconnect field |
| --- | --- |
| `controlNumber` | `passenger.pnr` |
| `travellerInfo/passengerData` (surname/given) | `passenger.name` |
| `frequentFlyer` FQTV CX / oneworld tier | `passenger.tier` (Diamond/Gold/Silver/Green) |
| `cabin` on the HKG outbound segment | `passenger.cabin` |
| SSR `UMNR` | `passenger.um = true` |
| SSR `WCHR` / `WCHS` / `WCHC` | `passenger.wheelchair = true` |
| Count of `travellerInfo` sharing the PNR | `passenger.partySize` (unsplittable) |
| Inbound/outbound `flightDesignator` + `flightDate` + times | `Connection.inbound` / `outbound` |

Feasibility still uses the HKG MCT table in `packages/engine` as the single source of truth. Wheelchair (+15 min) and UM escort (+20 min) are **additive** documented buffers; they do not rewrite MCT.

### 3.4 Poll / push

- **Push (preferred):** Amadeus Event Hub / PNR event `PNRCHG` to `https://reconnect.hk.cathaypacific.com/ingest/altea/pnr` (mTLS, client cert `cx-reconnect-pilot`). Payload: record locator + office ID + event type. Reconnect then calls `PNR_Retrieve`.
- **Poll (fallback):** every 60 s, `Queue_List` on `HKGCX08AA` Q77; retrieve new locators only.

Rate: max 5 `PNR_Retrieve`/s per WSAP. Burst on typhoon: queue locally, do not open extra Altéa sessions.

## 4. Integration B — HKG FIDS MQTT hook

### 4.1 Broker

| Item | Pilot value |
| --- | --- |
| Broker | HKG AODB/FIDS MQTT, SITA / AAHK operational network |
| Host (UAT) | `mqtts://fids-uat.aodb.hkg.aero:8883` |
| Host (PROD) | `mqtts://fids.aodb.hkg.aero:8883` |
| Protocol | MQTT 5.0, QoS 1, `cleanStart=false`, session expiry 3600 s |
| Auth | mTLS. Client CN `reconnect-cx-hkg`. CA: AAHK Airport Ops CA. |
| Keepalive | 30 s |

Reconnect does **not** subscribe to the public FIDS website. It uses the operational topic tree.

### 4.2 Topics

```
fids/hkg/{direction}/{flightDate}/{carrier}{flightNumber}
```

Examples:

- `fids/hkg/arrivals/2026-11-16/CX254`
- `fids/hkg/departures/2026-11-16/CX250`

Wildcard for the transfer desk: `fids/hkg/+/+/CX#` plus oneworld partners used in recovery (`BA`, `QR`, `JL`, `QF`, `MH`, `AY`, `AA`, `IB`).

### 4.3 Payload (JSON, UTF-8)

```json
{
  "airport": "HKG",
  "direction": "arrival",
  "flightNumber": "CX254",
  "airline": "CX",
  "origin": "TPE",
  "destination": "HKG",
  "std": "2026-11-16T16:20:00+08:00",
  "sta": "2026-11-16T18:05:00+08:00",
  "etd": "2026-11-16T18:50:00+08:00",
  "eta": "2026-11-16T20:35:00+08:00",
  "gate": "64",
  "status": "DELAYED",
  "delayMinutes": 150,
  "eventTime": "2026-11-16T18:12:44+08:00",
  "source": "HKG-AODB"
}
```

`eventTime` is the sim/production clock. Reconnect must not substitute the iPad wall clock.

Status enum: `SCHEDULED | DELAYED | GATE_CHANGE | DEPARTED | ARRIVED | CANCELLED | DIVERTED`.

On `DELAYED` or `CANCELLED` for an inbound with HKG connections, Reconnect re-runs `triageConnection` and refreshes the iPad queue without a page reload (same behaviour as **Simulate Typhoon Delay** / **Late Inbound CX254** in the demo).

### 4.4 Mapping to engine `Flight`

| FIDS field | `Flight` |
| --- | --- |
| `flightNumber`, `airline`, `origin`, `destination`, `gate` | identity |
| `std` / `sta` | `scheduledDeparture` / `scheduledArrival` |
| `etd` / `eta` | `actualDeparture` / `actualArrival` |
| `delayMinutes` | `delayMinutes` |
| `status` | `scheduled \| delayed \| departed \| arrived` |

Seat counts do **not** come from FIDS. They come from Altéa inventory / DCS `PaxList` remaining seats by cabin. Business exhaustion triggers engine downgrade protection (lower cabin, whole party on one flight, human-readable reasoning).

## 5. Integration C — Cathay Mobile App push

### 5.1 Endpoint

| Item | Pilot value |
| --- | --- |
| API | Cathay App Notification Service (CANS) |
| UAT | `https://mobile-uat.cathaypacific.com/cans/v2/push` |
| PROD | `https://mobile-api.cathaypacific.com/cans/v2/push` |
| Auth | OAuth2 client-credentials. Token: `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` scope `api://cx-cans/.default` |
| Idempotency | Header `Idempotency-Key: {pnr}-{recoveryFlight}-{epochMinute}` |

Agent **Approve Rebooking & Send** is the only caller. Raw LLM text is labeled Draft and passed through the flight-number guard. Hallucinated flight numbers are replaced with:

`[Cathay Alert] Your flight {original} has been protected on {recovery} departing at {hh:mm}.`

### 5.2 Request body

```http
POST /cans/v2/push HTTP/1.1
Host: mobile-api.cathaypacific.com
Authorization: Bearer {token}
Content-Type: application/json
Idempotency-Key: W4N9KD-CX252-202611161330

{
  "channel": "push",
  "locale": "en",
  "memberId": "CX-FFP-optional",
  "pnr": "W4N9KD",
  "templateId": "reconnect.missed_connection.v1",
  "deepLink": "cxapp://itinerary/W4N9KD",
  "data": {
    "originalFlight": "CX250",
    "recoveryFlight": "CX252",
    "origin": "HKG",
    "destination": "LHR",
    "departureHkt": "21:30",
    "gate": "15"
  },
  "body": "[Cathay Alert] Your flight CX250 has been protected on CX252 departing at 21:30.",
  "audit": {
    "actor": "HKG-T1-GATE",
    "stationClock": "2026-11-16T20:15:00+08:00",
    "engineReasoning": ["...verbatim strings..."]
  }
}
```

Allowed locales: `en`, `zh-Hant`, `ja` (console locale tabs). CANS fans out to APNs / FCM. Reconnect does not hold device tokens.

### 5.3 Failure handling

| CANS response | Agent UI |
| --- | --- |
| 202 Accepted | PNR leaves the live queue (same as demo step 6) |
| 409 duplicate idempotency | Treat as success |
| 4xx/5xx | Keep PNR on queue; show error; do not call Altéa write |

## 6. What stays inside Reconnect (not integrated)

- Option generation, MCT, UM escort, wheelchair buffer, unsplittable party, downgrade protection: `packages/engine` only.
- Seeded disruption for stage demo: `packages/sim` (`injectTyphoon`, `injectFlightDelay("CX254")`).
- LLM: `apps/console/lib/llm/*` and `POST /api/draft` only. Never for feasibility or ranking.

## 7. Security, privacy, operations

- PNR data is restricted to HKG transfer-desk AD groups. 90-day audit retention.
- No PNR in LLM prompts beyond name, tier, cabin, and the three allowed flight numbers.
- Network: Reconnect UAT sits on CX DCI; MQTT and Altéa are allow-listed; no public internet except CANS and (optional) OpenAI/Anthropic for draft, both outbound-only.
- Kill switch: feature flag `RECONNECT_PILOT=off` returns the desk to Altéa cryptic / Q77 only.

## 8. Pilot success criteria (IT)

1. FIDS MQTT delay on CX254 (or typhoon set) produces a non-empty at-risk queue within 5 seconds of `eventTime`.
2. Every displayed option includes human-readable `reasoning[]` from the engine, not the LLM.
3. Push body never contains a flight number absent from inbound, outbound, or the selected recovery option.
4. `pnpm typecheck` remains clean; `pnpm test:demo` stays green on the six-step path.

## 9. Decision asked of IT directors

Approve UAT credentials for:

1. Altéa WSAP `1ASIWCXCX` / office `HKGCX08AA` (PNR_Retrieve + Queue_List).
2. MQTT client cert on `fids-uat.aodb.hkg.aero`.
3. CANS OAuth client `cx-reconnect-pilot` on the UAT push URL.

Write access to Altéa (`PNR_AddMultiElements`) is a separate CAB after the 30-day read/notify pilot.
