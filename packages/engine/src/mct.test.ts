import { describe, expect, it } from "vitest";
import {
  GATE_WALK_BUFFER_MINUTES,
  HKG_MCT_MINUTES,
  UM_ESCORT_BUFFER_MINUTES,
  WHEELCHAIR_TRANSIT_BUFFER_MINUTES,
  carrierFamily,
  extraTransitMinutes,
  hkgMctMinutes,
  isOneworldAirline,
  requiredMinutes,
  requiredMinutesFor,
} from "./mct";

const FAMILIES = ["CX", "UO", "ONEWORLD", "OTHER"] as const;

describe("mct table", () => {
  it("classifies carriers", () => {
    expect(carrierFamily("CX")).toBe("CX");
    expect(carrierFamily("UO")).toBe("UO");
    expect(carrierFamily("BA")).toBe("ONEWORLD");
    expect(carrierFamily("5J")).toBe("OTHER");
    expect(isOneworldAirline("QR")).toBe(true);
    expect(isOneworldAirline("UO")).toBe(false);
  });

  it("is the single source of truth for every family pair", () => {
    expect(GATE_WALK_BUFFER_MINUTES).toBe(10);
    expect(hkgMctMinutes("CX", "CX")).toBe(50);
    expect(requiredMinutes("CX", "CX")).toBe(60);
    expect(hkgMctMinutes("CX", "BA")).toBe(60);
    expect(hkgMctMinutes("UO", "CX")).toBe(70);
    expect(hkgMctMinutes("5J", "5J")).toBe(80);
    expect(extraTransitMinutes({})).toBe(0);
    expect(extraTransitMinutes({ wheelchair: true })).toBe(WHEELCHAIR_TRANSIT_BUFFER_MINUTES);
    expect(extraTransitMinutes({ um: true })).toBe(UM_ESCORT_BUFFER_MINUTES);
    expect(extraTransitMinutes({ ssr: ["UMNR"] })).toBe(UM_ESCORT_BUFFER_MINUTES);
    expect(extraTransitMinutes({ ssr: ["WCHR"] })).toBe(WHEELCHAIR_TRANSIT_BUFFER_MINUTES);
    expect(extraTransitMinutes({ wheelchair: true, ssr: ["WCHC"] })).toBe(WHEELCHAIR_TRANSIT_BUFFER_MINUTES);
    expect(extraTransitMinutes({ um: true, wheelchair: true })).toBe(
      WHEELCHAIR_TRANSIT_BUFFER_MINUTES + UM_ESCORT_BUFFER_MINUTES,
    );
    expect(requiredMinutesFor("CX", "CX", {})).toBe(60);
    expect(requiredMinutesFor("CX", "CX", { wheelchair: true })).toBe(75);
    expect(requiredMinutesFor("CX", "CX", { ssr: ["UMNR", "WCHS"] })).toBe(95);
    expect(HKG_MCT_MINUTES.CX_CX).toBe(50);
    const sample = { CX: "CX", UO: "UO", ONEWORLD: "BA", OTHER: "5J" } as const;
    for (const inbound of FAMILIES) {
      for (const outbound of FAMILIES) {
        const key = `${inbound}_${outbound}` as const;
        expect(HKG_MCT_MINUTES[key]).toBeGreaterThan(0);
        expect(hkgMctMinutes(sample[inbound], sample[outbound])).toBe(HKG_MCT_MINUTES[key]);
      }
    }
  });
});
