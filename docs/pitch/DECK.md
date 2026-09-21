# Reconnect — speaker deck

One deck for a principal review. Same object as [`docs/apply-27-sep.md`](../apply-27-sep.md).
Family desk, UM/WCH, beside Passenger Recovery, six steps, 30-day read/notify ask.
`docs/SCOPE.md` stays frozen. Not a promised result.

`---` below is a slide break.

---

## 1. The desk that does not split the family

Reconnect.

Ruililin Shen is asking Cathay Pacific Airport Systems and the HKG Transfer desk (Altéa office `HKGCX08AA`) to own the missed-connection desk that does not split the family.

Unaccompanied-minor and wheelchair custody stay on one connection, on one worker iPad, beside Passenger Recovery.

**Say.** Sentence one is the desk, not a model. Typhoon loads the evening bank. It is not the noun. Do not open with AI, agent, or dashboard.

---

## 2. Who it is for

The person on the HKG T1 transfer desk, on their own iPad, landscape. Next to them: the transfer supervisor and DCS. The business unit is Airport Systems, with HKG Ground / Transfer.

Passengers do not get a chat.

Team on the form, if confirmed: Ruililin Shen (owner). Devano (build). Otto Ma (pitch and demo tape). Emails and student IDs are not in the repo. The human fills them.

**Say.** The glass is the worker’s. Unselected names in `docs/briefing/TEAM.md` stay off the form.

---

## 3. Beside Passenger Recovery

HKG transfer work in the last 90 minutes is still Altéa queue Q77, cryptic, at office `HKGCX08AA`.

Mass disruption already has a home. Incumbent figure, `docs/PILOT_PROPOSAL.md` §1.1: about 8,000 passengers in 40 minutes (Rogers / Ling, Airport Industry Review, 2019), plus self-rebook and 15below. That figure is the incumbent stack. It is not a Reconnect metric.

Those systems do not keep an unaccompanied minor, a wheelchair, and an unsplittable family on one Cathay flight when the inbound is late.

**Say.** Beside Passenger Recovery, for the last 90 minutes. Not instead of it.

---

## 4. UM, wheelchair, unsplittable party

One connection on one iPad. The engine is deterministic TypeScript. No model in the decision.

It flags a connection as at risk when slack is under HKG minimum connecting time plus a flat 10-minute walk. It adds 15 minutes for a wheelchair and 20 minutes for an unaccompanied-minor escort. Those buffers sit on top of the MCT table. They do not rewrite it. CX–CX MCT is 50 minutes.

Unaccompanied-minor recovery stays on Cathay metal. The party stays in one cabin on one flight. If Business is exhausted, downgrade protection holds the next cabin and says so.

The screen shows the engine’s `reasoning` lines verbatim. The model does not pick the flight.

**Say.** Custody is the wedge. A typhoon is how the bank loads.

---

## 5. Six steps

Working click. Same seed, same output. Header clock is station time. A **SIM** badge is on the header. If the draft service is down, **Offline draft** shows on that header. That is a talk beat, not another step.

1. Open the desk. HKG station clock is visible.
2. At-risk queue from the seeded evening bank. Healthy connections stay silent. A handling chip (`UM`, `WCH`, or `party of N`) is on a row.
3. **Simulate Typhoon Delay** adds 90 minutes to HKG inbounds. A Peak chip shows.
4. **Late Inbound CX254** delays that inbound 180 minutes. Named rows include UM `W4N9KD` (Mei Chan), Mina Choi, `MIXED4` Cole Family (UM + WCH + party of 4), Grace Ho, and `FIRST1` Elena Rossi.
5. Select a recovery option. Reasoning on the card is the engine’s.
6. Guarded draft, then **Approve Rebooking & Send**. That PNR leaves the live queue.

Stage date in this repo is 16 Nov 2026. The prior calendar’s final pitch is 15 Nov 2026. Same six steps.

**Say.** Stop at six. Do not add a step for the badge or the offline draft.

---

## 6. Numbers a judge can check

All bank counts are `demoMetrics("hkg-demo")` in `docs/METRICS.md`. They are **seeded**. They are not a live-ops result.

| What | Count | Label |
| --- | --- | --- |
| Flights / HKG inbounds / connections | 120 / 50 / 300 | seeded |
| At risk at bank start | 122 | seeded |
| Recovery options at bank start | 57 | seeded |
| After typhoon: delayed inbounds | 50 | seeded |
| At risk after typhoon | 175 | seeded |
| Recovery options after typhoon | 69 | seeded |
| Unaccompanied minors at risk after typhoon, kept on CX metal | 13 of 13 | seeded |
| At risk after CX254 +180 | 131 | seeded |
| Recovery options after CX254 +180 | 65 | seeded |
| Passenger Recovery mass reaccommodation | about 8,000 passengers / 40 minutes | incumbent |

Say the 13 minors stay on Cathay metal and are not offered a next-calendar-day flight. Do not convert these counts into minutes saved, euro saved, or hotel nights.

**Say.** Seeded counts from our sim. The 8,000 / 40 minutes line is the incumbent, cited, not ours.

---

## 7. The ask: 30 days, read and notify

Same object as the demo. Controlled HKG T1 transfer-desk pilot.

Week 1 is read and notify:

1. Altéa Reservation / DCS read: `PNR_Retrieve` and `Queue_List` on Q77, office `HKGCX08AA`, WSAP `1ASIWCXCX`. `PNR_AddMultiElements` is preview only.
2. HKG FIDS MQTT on the operational AODB tree. Station time is FIDS `eventTime` (Asia/Hong_Kong).
3. Cathay App push (CANS) only after the desk approves, with a flight-number check on the body.

`RECONNECT_PILOT=off` returns the desk to Altéa cryptic / Q77. A write to Altéa is a separate change board after the 30-day read/notify pilot.

UAT asked of IT directors: Altéa WSAP credentials, an MQTT client certificate on the UAT broker, and CANS OAuth client `cx-reconnect-pilot`. This is a request. Do not say IT has approved.

**Say.** Primary ask: a 2026 Airport Systems / HKG Transfer owner for this pilot. Piggyback, same path: Cathay Innovate / intern-path. Not a second product.

---

## 8. Leave these blank

Named HKG Special Handling / HAS co-signer: blank until a real person signs. Do not invent the name.

Do not claim a confirmed broken escort handoff without their sentence. The engine facts do not need that signature. A custody-failure story does.

Do not promise a win. Do not paste HK$500k as this year’s prize. The 2026 fund figure was not in the 21 Sep official extract.

**Say.** Hand them `docs/apply-27-sep.md`. They paste. They fill the blanks.
