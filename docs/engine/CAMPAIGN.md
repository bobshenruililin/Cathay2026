# Engine campaign notebook

Referee: `pnpm --filter engine bench`. Protocol: hypothesis → invariant →
measurement → keep or revert. One kernel per commit. A keep needs the new
sample range entirely below the old one. Overlapping ranges are noise.

Noise band: 20% of the median-of-medians. Repeated runs on this host moved
by at most ~9%, so 20% is twice that envelope. The gate compares medians.
One spiked sample (generateOptions max 7_478_105 in baseline run B) did not
move that run's median outside the envelope.

Checksums never moved. Sort reference (`referenceOptions` / `referenceTriage`)
still deep-equals.

## Baseline before this campaign

Four runs of the hardened harness at ab08ef1, plus the gate run immediately
before the kernel edit. ns/op, median (min–max):

| Run | requiredMinutes | extraTransit | triageConnection | generateOptions |
| --- | --- | --- | --- | --- |
| A | 764_882 (760_718–804_591) | 11_638 (11_168–13_847) | 5_563_986 (5_478_994–5_870_172) | 5_093_563 (5_034_504–5_255_776) |
| B | 812_261 (780_974–892_735) | 11_770 (11_045–13_194) | 6_004_672 (5_865_018–6_276_515) | 5_569_099 (5_467_805–7_478_105) |
| C | 803_968 (788_940–834_669) | 12_439 (11_534–18_723) | 5_556_718 (5_453_679–6_128_028) | 5_115_550 (5_074_555–5_280_052) |
| D | 778_585 (771_086–808_138) | 12_143 (11_172–13_859) | 5_887_691 (5_651_261–6_064_074) | 5_434_684 (5_357_082–5_599_897) |
| gate | 764_370 (761_698–811_233) | 12_020 (11_351–14_155) | 5_613_151 (5_397_089–5_911_253) | 5_093_424 (5_053_880–5_179_303) |

Old generateOptions union: 5_034_504–7_478_105. Median-of-medians of A–D:
5_275_117. Old triage union low: 5_397_089.

Prior keep, already on the branch (`8653cf3`): emit-late reasoning and linear
select. Not re-opened. requiredMinutes and extraTransit overlapped then too.

## Kept — `generateOptions`

Hypothesis: hoist inbound/outbound epochs and extra-transit minutes, compare
the HKT day from the epoch (no `formatHkgIso` on losers), reject a flight
with `canSeat` before `Date.parse`.

Invariant: same flights, scores, cabins, and exact `reasoning[]`. Digest
`2193251c50d9fb5b0dc6299bb84929edeb6da9c1b63ed0cc1aa8545290415b0a`.

Five runs, `options.ts` only (runs 4–5 were taken while a triage edit was
also in the tree; `generateOptions` does not call triage):

| Run | median | min | max |
| --- | --- | --- | --- |
| 1 | 2_830_444 | 2_721_296 | 2_944_952 |
| 2 | 3_044_723 | 3_001_755 | 3_179_645 |
| 3 | 2_834_947 | 2_770_931 | 2_946_442 |
| 4 | 2_662_560 | 2_630_962 | 2_684_032 |
| 5 | 3_073_431 | 2_975_025 | 3_139_828 |

New union: 2_630_962–3_179_645. Median-of-medians: 2_834_947.
New max 3_179_645 < old min 5_034_504. Disjoint.

Median-of-medians 5_275_117 → 2_834_947 (**1.86×**). Back-to-back against the
gate run: 5_093_424 → 2_830_444 (**1.80×**), and 2_944_952 < 5_053_880.
Fastest old sample over slowest new sample: 5_034_504 / 3_179_645 = **1.58×**.

Floor now: median 2_834_947, band 566_989 (fail above 3_401_936).

`triageConnection` samples also dropped (3_202_621, 3_497_068, 3_262_818;
union high 3_708_353 < old low 5_397_089) because triage calls
`generateOptions` when the connection is at risk. Same digest. That is one
kernel, not a second keep. Its floor moved so a revert fails both rows:
median 3_262_818, band 652_564 (fail above 3_915_382).

## Reverted — `triageConnection` hoist

Hypothesis: compute slack, required, and status once inside triage instead of
calling `connectionStatus` and `isAtRisk` again.

Invariant: same status, slack, required, notes, `reasoning[]`. Digest stayed
`18c2d7f740b238de6c433407dd7cabf83255b35dfc6ec771c3b647fc0906503f`.

Two runs after the keep above: median 3_217_619 (2_951_989–3_374_472) and
3_437_546 (3_186_859–3_597_099). Those ranges overlap
3_093_660–3_708_353. Noise. Reverted. No triage source change shipped.

## Stopped — `requiredMinutes` / `extraTransit`

Hypothesis: a tighter MCT lookup cannot show up, because the harness times
the digest of the whole table.

Measurement (kernel calls only, not kept as a code change): `requiredMinutes`
+ `extraTransitMinutes` + `requiredMinutesFor` across the carrier × passenger
table, median 107_694 ns. Harness median for that kernel is 791_277 with band
158_255. Deleting the arithmetic would still land inside the band. extraTransit
harness median is ~12_000 ns. No edit.

## Stop

One additional kernel kept. Second candidate reverted. No third attempt.
