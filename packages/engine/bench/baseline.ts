import type { KernelName } from "./workload";

/**
 * Regression floor for `pnpm --filter engine bench`.
 *
 * medianNs is the median-of-medians of four harness runs on the hardened
 * bench at ab08ef1 (same samples, same host). bandNs is 20% of that median:
 * those four runs moved by at most ~9%, so 20% is twice the observed
 * envelope. The gate compares medians, not a single spiked sample.
 * A keep replaces that kernel's row; do not widen the band to hide a slowdown.
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
    medianNs: 5_725_839,
    bandNs: 1_145_168,
  },
  generateOptions: {
    checksum: "2193251c50d9fb5b0dc6299bb84929edeb6da9c1b63ed0cc1aa8545290415b0a",
    medianNs: 5_275_117,
    bandNs: 1_055_023,
  },
};
