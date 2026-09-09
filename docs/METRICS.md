# Metrics

Numbers on stage come from `packages/sim` only. Function:
`demoMetrics("hkg-demo")`. Same seed → same counts. Do not quote ConnectGuard
€25M, SWISS 2–3 minutes, or any hotel-night / carbon figure the sim does not
produce.

Refresh: `pnpm --filter sim test` (locks `src/metrics.test.ts`).

## Evening bank (seed `hkg-demo`)

| Count | Value |
| --- | --- |
| Flights | 120 |
| Inbounds to HKG | 50 |
| Connections | 300 |
| At-risk at bank start | 123 |
| Recovery options generated | 62 |

## Simulate Typhoon Delay (90 minutes on HKG inbounds)

| Count | Value |
| --- | --- |
| Delayed inbounds | 50 |
| At-risk | 176 |
| Recovery options generated | 59 |
| Unaccompanied minors at risk | 13 |
| Of those, kept on CX metal | 13 |

Typhoon can *cut* option count (59 vs 62) because more connections miss the
pool. Unaccompanied minors never receive next-calendar-day flights. Say that;
do not invent a minutes-saved ROI.

## Late Inbound CX254 (180 minutes)

| Count | Value |
| --- | --- |
| At-risk | 131 |
| Recovery options generated | 61 |

## Not in this file

Hotel nights, EU261 payouts, cargo ULD labour, green points. If a pitch line
needs them, add a sim counter first — do not back-solve from a vendor slide.
