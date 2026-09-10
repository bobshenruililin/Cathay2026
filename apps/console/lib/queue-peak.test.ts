import { describe, expect, it } from "vitest";
import { queuePeakLabel } from "./queue-peak";

describe("queue peak flood state", () => {
  it("stays quiet when the bank has no delayed flights or an empty action queue", () => {
    expect(queuePeakLabel(124, 0)).toBeNull();
    expect(queuePeakLabel(0, 50)).toBeNull();
  });

  it("labels a typhoon-style flood when delayed flights and at-risk rows coincide", () => {
    expect(queuePeakLabel(174, 50)).toBe("Peak — 174 at-risk · 50 delayed");
  });
});
