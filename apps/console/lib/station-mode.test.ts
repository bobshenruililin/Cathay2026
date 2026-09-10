import { describe, expect, it } from "vitest";
import { isSimMode, stationModeBadges } from "./station-mode";

describe("station mode badges", () => {
  it("treats an unset adapter flag as live sim", () => {
    expect(isSimMode(undefined)).toBe(true);
    expect(isSimMode("")).toBe(true);
    expect(isSimMode("mock")).toBe(false);
  });

  it("shows SIM on the live path and Offline draft only after fallback", () => {
    expect(stationModeBadges(true, false)).toEqual([{ testId: "sim-badge", label: "SIM" }]);
    expect(stationModeBadges(true, true)).toEqual([
      { testId: "sim-badge", label: "SIM" },
      { testId: "offline-draft-badge", label: "Offline draft" },
    ]);
    expect(stationModeBadges(false, true)).toEqual([
      { testId: "offline-draft-badge", label: "Offline draft" },
    ]);
    expect(stationModeBadges(false, false)).toEqual([]);
  });
});
