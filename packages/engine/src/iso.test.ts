import { describe, expect, it } from "vitest";
import { addMinutesIso, formatHkgIso, hkgCalendarDay, minutesBetween } from "./iso";

describe("iso", () => {
  it("formats HKT from epoch milliseconds", () => {
    expect(formatHkgIso(Date.parse("2026-11-16T10:00:00.000Z"))).toBe(
      "2026-11-16T18:00:00+08:00",
    );
  });

  it("adds minutes and reports slack", () => {
    const start = "2026-11-16T18:00:00+08:00";
    const later = addMinutesIso(start, 50);
    expect(later).toBe("2026-11-16T18:50:00+08:00");
    expect(minutesBetween(start, later)).toBe(50);
  });

  it("uses the HKT calendar day", () => {
    expect(hkgCalendarDay("2026-11-16T23:30:00+08:00")).toBe("2026-11-16");
    expect(hkgCalendarDay("2026-11-17T01:15:00+08:00")).toBe("2026-11-17");
  });
});
