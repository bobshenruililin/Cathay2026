import { describe, expect, it } from "vitest";
import { generateOptions, triageConnection } from "../src/index";
import { BASELINE } from "./baseline";
import { observeOption, observeTriage } from "./canonical";
import { formatReport, sampleKernel } from "./harness";
import { freshMatrix } from "./matrix";
import { referenceOptions } from "./reference";
import { referenceTriage } from "./reference-triage";
import { formatScoreboard, formatScoreboardLine } from "./scoreboard";
import { GOLDEN, loadWorkload } from "./workload";

describe("engine kernel benches", () => {
  it("deep-equals the sort reference outside timed work", () => {
    for (const cell of freshMatrix()) {
      expect(observeOptionList(generateOptions(cell.connection, cell.pool)), cell.id).toEqual(
        observeOptionList(referenceOptions(cell.connection, cell.pool)),
      );
      expect(observeTriage(triageConnection(cell.connection, cell.pool)), cell.id).toEqual(
        observeTriage(referenceTriage(cell.connection, cell.pool)),
      );
    }
  });

  it("reports median + range over multiple samples with a full-field digest", () => {
    const rows = loadWorkload().map((kernel) => {
      const heavy = kernel.name === "generateOptions" || kernel.name === "triageConnection";
      return sampleKernel(kernel.name, kernel.run, {
        warmup: 2,
        samples: 7,
        iterationsPerSample: heavy ? 24 : 400,
      });
    });
    const lines: string[] = [];
    for (const row of rows) {
      console.log(formatReport(row));
      const base = BASELINE[row.name];
      const line = formatScoreboardLine(row, base);
      lines.push(line);
      expect(base.checksum, `${row.name} baseline checksum out of date`).toBe(GOLDEN[row.name]);
      expect(row.checksum, `${row.name} digest drifted — not a speedup`).toBe(GOLDEN[row.name]);
      expect(row.medianNs, line).toBeLessThanOrEqual(base.medianNs + base.bandNs);
      expect(row.samples).toHaveLength(7);
      expect(row.minNs).toBeGreaterThan(0);
      expect(row.maxNs).toBeGreaterThanOrEqual(row.medianNs);
      expect(row.medianNs).toBeGreaterThanOrEqual(row.minNs);
    }
    console.log(formatScoreboard(lines));
  });
});

function observeOptionList(options: ReturnType<typeof generateOptions>) {
  return options.map(observeOption);
}
