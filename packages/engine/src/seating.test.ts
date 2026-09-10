import { describe, expect, it } from "vitest";
import { INBOUND, makeFlight, makePassenger } from "./fixtures";
import { isUnaccompaniedMinor, needsWheelchair, partySizeOf } from "./passenger";
import { seatMatch } from "./score";
import { partySeating } from "./seating";

describe("passenger defaults", () => {
  it("treats omitted and non-positive party size as 1", () => {
    expect(partySizeOf(makePassenger())).toBe(1);
    expect(partySizeOf(makePassenger("A", "Gold", "Business", { partySize: 0 }))).toBe(1);
    expect(isUnaccompaniedMinor(makePassenger())).toBe(false);
    expect(needsWheelchair(makePassenger())).toBe(false);
    expect(isUnaccompaniedMinor(makePassenger("U", "Green", "Economy", { ssr: ["UMNR"] }))).toBe(true);
    expect(needsWheelchair(makePassenger("W", "Gold", "Business", { ssr: ["WCHR"] }))).toBe(true);
    expect(needsWheelchair(makePassenger("W", "Gold", "Business", { wheelchair: true, ssr: ["WCHC"] }))).toBe(true);
  });
});

describe("party seating", () => {
  it("does not auto-upgrade Economy when only higher cabins have seats", () => {
    const flight = makeFlight(
      "CX900",
      "CX",
      "HKG",
      "LHR",
      INBOUND.actualDeparture,
      INBOUND.actualArrival,
      { First: 2, Business: 10, "Premium Economy": 8, Economy: 0 },
    );
    expect(partySeating(flight, makePassenger("E", "Green", "Economy"))).toBeUndefined();
    expect(seatMatch(flight, "Economy", 4)).toBe(false);
    expect(seatMatch(flight, "Business", 0)).toBe(true);
  });
});
