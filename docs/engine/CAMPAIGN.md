# Engine campaign notebook

Referee: `pnpm --filter engine bench`. Protocol: hypothesis → invariant →
measurement → keep or revert. One kernel per commit. A keep needs the new
sample range entirely below the old one. Overlapping ranges are noise.

Noise band: median-of-medians of repeated harness runs, plus 20%. Four runs
on the hardened bench moved by at most ~9%, so 20% is twice that envelope.
The gate compares medians. One spiked sample (generateOptions max 7_478_105
in run B) did not move that run's median outside the envelope, so the band
is not the spike.

## Baseline (ab08ef1 harness, this host)

Checksums unchanged from `GOLDEN`. ns/op:

| Run | requiredMinutes | extraTransit | triageConnection | generateOptions |
| --- | --- | --- | --- | --- |
| A | 764_882 (760_718–804_591) | 11_638 (11_168–13_847) | 5_563_986 (5_478_994–5_870_172) | 5_093_563 (5_034_504–5_255_776) |
| B | 812_261 (780_974–892_735) | 11_770 (11_045–13_194) | 6_004_672 (5_865_018–6_276_515) | 5_569_099 (5_467_805–7_478_105) |
| C | 803_968 (788_940–834_669) | 12_439 (11_534–18_723) | 5_556_718 (5_453_679–6_128_028) | 5_115_550 (5_074_555–5_280_052) |
| D | 778_585 (771_086–808_138) | 12_143 (11_172–13_859) | 5_887_691 (5_651_261–6_064_074) | 5_434_684 (5_357_082–5_599_897) |

Committed floor (`packages/engine/bench/baseline.ts`):

| Kernel | median ns/op | band ns | fail if median above |
| --- | --- | --- | --- |
| requiredMinutes | 791_277 | 158_255 | 949_532 |
| extraTransit | 11_957 | 2_391 | 14_348 |
| triageConnection | 5_725_839 | 1_145_168 | 6_871_007 |
| generateOptions | 5_275_117 | 1_055_023 | 6_330_140 |

Prior keep, already on this branch, not re-opened here: emit-late reasoning
and linear select in `generateOptions` (`8653cf3`). Full-field SHA-256 matched
the sort reference. Claimed median about 7.0× versus the pre-harden sort path.
requiredMinutes and extraTransit overlapped; no claim.

## Trials

Recorded in later commits on this branch. No additional kernel was kept in
the baseline commit.
