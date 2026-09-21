import type { KernelName } from "./workload";

/**
 * Regression floor for `pnpm --filter engine bench`.
 *
 * medianNs is a median-of-medians on this host. bandNs is 20% of that
 * median: repeated runs moved by at most ~9%, so 20% is twice the envelope.
 * The gate compares medians, not a single spiked sample.
 * A keep replaces that kernel's row; do not widen the band to hide a slowdown.
 * generateOptions and triageConnection floors moved together after the
 * generateOptions keep (triage calls it). requiredMinutes and extraTransit
 * are still the ab08ef1 envelope.
 */
export type KernelBaseline = {
  checksum: string;
  medianNs: number;
  bandNs: number;
};

export const BASELINE: Record<KernelName, KernelBaseline> = {
  requiredMinutes: {
    checksum: "5760c2deef531cabb2cda1e55cc55d7e788ea38151642e776f95d2bfbd207635",
    medianNs: 791_277,
    bandNs: 158_255,
  },
  extraTransit: {
    checksum: "ac2c215cb23bca3c01bc758ea4efa2a3ae2afe139d131bd9080bbf9e0e83bb40",
    medianNs: 11_957,
    bandNs: 2_391,
  },
  triageConnection: {
    checksum: "18c2d7f740b238de6c433407dd7cabf83255b35dfc6ec771c3b647fc0906503f",
    medianNs: 3_262_818,
    bandNs: 652_564,
  },
  generateOptions: {
    checksum: "2193251c50d9fb5b0dc6299bb84929edeb6da9c1b63ed0cc1aa8545290415b0a",
    medianNs: 2_834_947,
    bandNs: 566_989,
  },
};
