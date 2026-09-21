import type { KernelBaseline } from "./baseline";
import type { BenchReport } from "./harness";

export type ScoreVerdict = "ok" | "DIGEST" | "REGRESS";

export function scoreVerdict(row: BenchReport, base: KernelBaseline): ScoreVerdict {
  if (row.checksum !== base.checksum) return "DIGEST";
  if (row.medianNs > base.medianNs + base.bandNs) return "REGRESS";
  return "ok";
}

export function formatScoreboardLine(row: BenchReport, base: KernelBaseline): string {
  const deltaPct = ((row.medianNs - base.medianNs) / base.medianNs) * 100;
  const sign = deltaPct > 0 ? "+" : "";
  const verdict = scoreVerdict(row, base);
  return [
    row.name.padEnd(18),
    `now=${row.medianNs.toFixed(0).padStart(10)}`,
    `base=${base.medianNs.toFixed(0).padStart(10)}`,
    `band=${base.bandNs.toFixed(0).padStart(10)}`,
    `delta=${sign}${deltaPct.toFixed(1)}%`,
    verdict,
  ].join("  ");
}

export function formatScoreboard(lines: string[]): string {
  return ["scoreboard  (DIGEST or median > base+band fails)", ...lines].join("\n");
}
