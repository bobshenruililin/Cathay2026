import { describe, expect, it } from "vitest";
import { collectTriage } from "./queue";
import { seedFlights, seedLinks } from "./mock-bank";

describe("collectTriage quiet default", () => {
  it("keeps at-risk PNRs on the action queue and counts healthy as silent", () => {
    const { queue, quietCount } = collectTriage(seedLinks(), seedFlights());
    expect(quietCount).toBeGreaterThan(0);
    expect(queue.some((item) => item.passenger.pnr === "OK9SIL")).toBe(false);
    for (const item of queue) {
      expect(item.result.atRisk).toBe(true);
    }
  });
});
