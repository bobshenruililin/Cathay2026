# Reconnect — 27 Sep 2026 application draft

Status: draft for a human to paste. Not submitted. Not a promise of a result.

Mode: `apply` only. Feature Zero stays the six steps in `docs/DEMO.md`. `docs/SCOPE.md` stays frozen. This file does not edit the repo.

**Prize math.** Primary: a 2026 Airport Systems / HKG Transfer owner for the 30-day read/notify pilot. Piggyback: Cathay Innovate / intern-path on that same pilot and the same six steps.

---

## Official page vs `events.md`

Fetched once on 21 Sep 2026: [https://hackathon.cathaypacific.com/en_HK](https://hackathon.cathaypacific.com/en_HK).

The extract was the title **Cathay Hackathon** only. No deadline, track split, rubric weights, pitch length, or prize list was in the extract.

`events.md` (prior, fetched 13 Sep 2026) records HTTP 422 on that URL and a HKSYU student calendar. This extract does not restate HTTP 422 and does not publish a replacement calendar. Spine not rewritten.

Calendar below is that prior, labeled prior. Still unknown: 2026 employee-track dates if they differ from the HKSYU copy; exact rubric weights; who from Airport Systems sits in the room.

---

## Paste these sections

Form field names and character limits were not on the official extract. Paste into the matching boxes. Trim if a box is shorter. Do not paste the gaps or the checkpoint.

### Project title

Reconnect

### One sentence

Ruililin Shen is asking Cathay Pacific Airport Systems and the HKG Transfer desk (Altéa office `HKGCX08AA`) to own the missed-connection desk that does not split the family: unaccompanied-minor and wheelchair custody stay on one connection, on one worker iPad, beside Passenger Recovery.

### Team

| Role on this form | Name | What the repo already says |
| --- | --- | --- |
| Owner / applicant | Ruililin Shen | GitHub `bobshenruililin`. Repo form of the name: Shen Ruililin. Owns the 27 Sep packet (`docs/briefing/TEAM.md`). |
| Build, if confirmed on the form | Devano | Selected — joining. Final-year HKU Data Science & Engineering (`docs/briefing/TEAM.md`). |
| Pitch and demo tape, if confirmed on the form | Otto Ma | Selected — joining. Final-year HKU Law, Journalism minor (`docs/briefing/TEAM.md`). |

Emails, student IDs, and phone numbers are not in the repo. The human fills them. Unselected candidates in `TEAM.md` stay off the form.

### Problem

HKG transfer work in the last 90 minutes is still Altéa queue Q77, cryptic, at office `HKGCX08AA`. Mass disruption already has a home: Amadeus Passenger Recovery (public figure in `docs/PILOT_PROPOSAL.md` §1.1: about 8,000 passengers in 40 minutes; Rogers / Ling, Airport Industry Review, 2019), plus self-rebook and 15below customer messages. Those systems do not keep an unaccompanied minor, a wheelchair, and an unsplittable family on one Cathay flight when the inbound is late.

The body the desk owns is that custody, from a late inbound to the outbound the engine can still protect. A typhoon is how the evening bank loads. It is not the problem we are naming.

### Who it is for

The person on the HKG T1 transfer desk, on their own iPad, landscape. Next to them: the transfer supervisor and DCS. The business unit in the room is Airport Systems, with HKG Ground / Transfer. The glass is the worker’s. Passengers do not get a chat.

### What the desk gets

One connection on one iPad. The engine is deterministic TypeScript with no runtime dependencies and no model in the decision (`docs/HACKATHON.md` LIVE table; `packages/engine`). It flags a connection as at risk when slack is under HKG minimum connecting time plus a flat 10-minute walk, and it adds 15 minutes for a wheelchair and 20 minutes for an unaccompanied-minor escort. Those buffers sit on top of the MCT table. They do not rewrite it (`packages/engine/src/mct.ts`; CX–CX MCT is 50 minutes). Unaccompanied-minor recovery stays on Cathay metal. The party stays in one cabin on one flight. If Business is exhausted, downgrade protection holds the next cabin and says so.

The screen shows the engine’s `reasoning` lines verbatim. A draft step writes the passenger message only after a human picks an option. Invented flight numbers are replaced by the fixed line: `[Cathay Alert] Your flight CX... has been protected on CX... departing at ...` (`docs/DEMO.md` step 6). **Approve Rebooking & Send** is the only send. The model does not pick the flight.

### Thirty-day path (the ask)

Same object as the demo. Controlled HKG T1 transfer-desk pilot (`docs/PILOT_PROPOSAL.md`). Week 1 is read and notify:

1. Altéa Reservation / DCS read: `PNR_Retrieve` and `Queue_List` on Q77, office `HKGCX08AA`, WSAP `1ASIWCXCX`. `PNR_AddMultiElements` is preview only.
2. HKG FIDS MQTT on the operational AODB tree. Station time is FIDS `eventTime` (Asia/Hong_Kong). The iPad clock is not the source.
3. Cathay App push (CANS) only after the desk approves, with a flight-number check on the body.

`RECONNECT_PILOT=off` returns the desk to Altéa cryptic / Q77. A write to Altéa is a separate change board after the 30-day read/notify pilot. UAT asked of IT directors: Altéa WSAP credentials, an MQTT client certificate on the UAT broker, and CANS OAuth client `cx-reconnect-pilot`.

### Evidence (six steps, seeded)

Working click, not a seventh step (`docs/DEMO.md`). Same seed, same output. Header clock is `packages/sim` station time. A **SIM** badge is on the header. If the draft service is down, **Offline draft** shows on that header. That is a talk beat, not another step.

1. Open the desk. HKG station clock is visible.
2. At-risk queue from the seeded evening bank. Healthy connections stay silent. A handling chip (`UM`, `WCH`, or `party of N`) is on a row. Engine reasoning is on screen.
3. **Simulate Typhoon Delay** adds 90 minutes to HKG inbounds. The queue refreshes in place. A Peak chip shows. This loads the bank.
4. **Late Inbound CX254** delays that inbound 180 minutes. Named rows in the seed include UM `W4N9KD` (Mei Chan), SSR-only UMNR Mina Choi, `MIXED4` Cole Family (UM + WCH + party of 4, reasoning `Keep party COLE together`), SSR-only WCHR Grace Ho, and `FIRST1` Elena Rossi (`Hold Business instead`).
5. Select a recovery option. Reasoning on the card is the engine’s.
6. Guarded draft, then Approve. That PNR leaves the live queue.

Stage date in this repo is 16 Nov 2026. The prior calendar’s final pitch is 15 Nov 2026. Same six steps.

### Numbers a judge can check

All bank counts are `demoMetrics("hkg-demo")` in `docs/METRICS.md`. They are **SEEDED**. They are not a live-ops result and not a vendor saving.

| What | Count | Source |
| --- | --- | --- |
| Flights / HKG inbounds / connections | 120 / 50 / 300 | `docs/METRICS.md` |
| At risk at bank start | 122 | same |
| Recovery options at bank start | 57 | same |
| After typhoon (+90 min on inbounds): delayed inbounds | 50 | same |
| At risk after typhoon | 175 | same |
| Recovery options after typhoon | 69 | same |
| Unaccompanied minors at risk after typhoon, kept on CX metal | 13 of 13 | same |
| At risk after CX254 +180 | 131 | same |
| Recovery options after CX254 +180 | 65 | same |

Say the 13 minors stay on Cathay metal and are not offered a next-calendar-day flight. Do not convert these counts into minutes saved, euro saved, or hotel nights. The sim does not produce those.

The ~8,000 passengers / 40 minutes figure is the incumbent stack, cited in `docs/PILOT_PROPOSAL.md` §1.1. It is not a Reconnect metric.

### What this submission is asking to be scored as

Real-world impact with a business unit in the room (`docs/competitive/judging-2026.md`). Employee-track shape even if the names on the form are students: a desk tool for Cathay staff, paired with Airport Systems. 2025 split was 36 student teams (1,900 applications) and 12 employee teams (200 applications); FlyLab won employee and U-Explore won student (`docs/competitive/judging-2026.md`). Whether 2026 still splits tracks was not in today’s official extract.

### Boundaries (so the paste stays one product)

Reconnect sits beside Passenger Recovery for the last 90 minutes. Week 1 does not write `PNR_AddMultiElements`. There is no passenger chat, no cargo vision product, no trolley, no loyalty journey, and no green-points claim. Hold-the-outbound, gate-pair walks, and a live escort baton are not in the six steps. The iPad does not dispatch an escort. It prices UM, wheelchair, and party, and it refuses to split them.

---

## Prize math (do not add a second product)

| Slot | Play for | Same path |
| --- | --- | --- |
| Primary | 2026 Airport Systems / HKG Transfer owner | This packet + `docs/PILOT_PROPOSAL.md` + the six-step demo |
| Piggyback | Cathay Innovate / intern-path | The same 30-day read/notify pilot |

HKSYU tickets, Asia Miles, and GT are not a third path (`events.md`). The 2025 note that top three each track went to Cathay Innovate, fund up to HK$500k, is historical (`docs/competitive/judging-2026.md`). The 2026 fund figure was not in today’s official extract. Do not paste HK$500k as this year’s prize.

---

## Human gaps (do not paste into the form)

Blocking before submit:

1. **Named HKG Special Handling / HAS co-signer.** Leave the name blank until a real person signs. This draft does not invent it.
   - Name: _______________
   - Role: HKG Special Handling or HAS
   - Date: _______________
   - Their sentence, in their words, that UM / wheelchair custody through a missed connection is this desk’s problem: _______________
   - Without that sentence, do not claim they confirmed a broken escort handoff. The engine facts above do not need their signature. A custody-failure story does.

2. **Roster.** Confirm Devano and Otto Ma are on the submitted form. Fill legal name order, email, phone, and any student ID the form requires. Shen’s university is not stated in `docs/briefing/TEAM.md`; do not invent it.

3. **Form itself.** Track (student or employee), character limits, video or demo URL, and whether an internal Cathay sponsor is required. Unknown after the 21 Sep extract. If the form forces a track, keep this copy. Do not rewrite it into a lifestyle journey to match a student box.

4. **Who sits in the room.** Airport Systems / HKG Transfer person for November is unknown (`events.md`). Do not invent the name. If someone agrees to be named in the first 15 seconds of the November pitch, add them later. That is not this draft.

5. **UAT.** The pilot ask is a request. Credentials are not granted. Do not write “IT has approved.”

Non-blocking, still unknown: exact 2026 rubric weights; employee-track dates if they differ from the HKSYU prior (apply 27 Sep 2026 23:59 GMT+8; Master Classes 1–24 Oct; initial submission 12–25 Oct; Tech Master Class 7 Nov Shenzhen; 24-hour build 14–15 Nov; final pitch 15 Nov; this repo’s stage demo 16 Nov).

---

## Checkpoint

```
## Mode: apply
Sentence one: Ruililin Shen, Airport Systems / HKG Transfer (HKGCX08AA),
              the missed-connection desk that does not split the family
              (UM/WCH custody), beside Passenger Recovery.
              Typhoon is load, not the noun.
Sameness: opening does not lead with AI, agent, or dashboard.
Primary: 2026 desk owner via the 30-day read/notify pilot + six DEMO steps
Piggyback: Cathay Innovate / intern-path on that same pilot
Official extract 21 Sep 2026: title only. Spine not rewritten.
Not: a seventh step, a SCOPE unfreeze, a packages/** edit, a PR, a promised win
Next: human fills the co-signer, roster, and form blanks, then pastes.
      recon only if the official page later publishes rules.
Human: still frozen
```
