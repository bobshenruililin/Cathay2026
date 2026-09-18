import { describe, expect, it } from "vitest";
import { formatRow, timeKernel } from "./harness";
import { GOLDEN, loadWorkload } from "./workload";

describe("engine kernel benches", () => {
  it("warms up, reports ns/op, and checksums reasoning-bearing outputs", () => {
    const rows = loadWorkload().map((kernel) => {
      const iterations = kernel.name === "generateOptions" || kernel.name === "triageConnection" ? 200 : 2000;
      return timeKernel(kernel.name, kernel.run, { warmup: 20, iterations });
    });
    for (const row of rows) {
      console.log(formatRow(row));
      expect(row.checksum, `${row.name} output drifted — not a speedup`).toBe(GOLDEN[row.name]);
      expect(row.nsPerOp).toBeGreaterThan(0);
    }
  });
});
