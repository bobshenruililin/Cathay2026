import { describe, expect, it } from "vitest";
import {
  connectionRequiredMinutes,
  connectionStatus,
  isAtRisk,
  isFeasible,
  isValidItinerary,
  slackMinutes,
} from "./feasibility";
import { addMinutesIso } from "./iso";
import { INBOUND, makeConnection, makeFlight } from "./fixtures";

const ARR = INBOUND.actualArrival;

describe("feasibility", () => {
  it("treats slack equal to MCT plus buffer as feasible (tight-but-legal)", () => {
    const outbound = makeFlight(
      "CX250",
      "CX",
      "HKG",
      "LHR",
      addMinutesIso(ARR, 60),
      addMinutesIso(ARR, 840),
    );
    const connection = makeConnection(INBOUND, outbound);
    expect(connectionRequiredMinutes(connection)).toBe(60);
    expect(slackMinutes(connection)).toBe(60);
    expect(isFeasible(connection)).toBe(true);
    expect(isValidItinerary(connection)).toBe(true);
  });

  it("rejects a missed connection below MCT plus buffer", () => {
    const outbound = makeFlight(
      "CX250",
      "CX",
      "HKG",
      "LHR",
      addMinutesIso(ARR, 45),
      addMinutesIso(ARR, 825),
    );
    expect(isFeasible(makeConnection(INBOUND, outbound))).toBe(false);
  });

  it("rejects invalid itineraries", () => {
    const outbound = makeFlight(
      "CX250",
      "CX",
      "HKG",
      "LHR",
      addMinutesIso(ARR, 120),
      addMinutesIso(ARR, 900),
    );
    const notHkgIn = makeFlight("CX1", "CX", "TPE", "NRT", ARR, ARR);
    const notHkgOut = makeFlight("CX2", "CX", "TPE", "LHR", ARR, ARR);
    const emptyIn = { ...INBOUND, flightNumber: "" };
    const emptyOut = { ...outbound, flightNumber: "" };
    const same = makeFlight("CX401", "CX", "HKG", "LHR", ARR, ARR);
    const badTime = { ...INBOUND, actualArrival: "not-a-time" };
    const badDep = { ...outbound, actualDeparture: "nope" };
    expect(isValidItinerary(makeConnection(notHkgIn, outbound))).toBe(false);
    expect(isValidItinerary(makeConnection(INBOUND, notHkgOut))).toBe(false);
    expect(isValidItinerary(makeConnection(emptyIn, outbound))).toBe(false);
    expect(isValidItinerary(makeConnection(INBOUND, emptyOut))).toBe(false);
    expect(isValidItinerary(makeConnection(INBOUND, same))).toBe(false);
    expect(isValidItinerary(makeConnection(badTime, outbound))).toBe(false);
    expect(isValidItinerary(makeConnection(INBOUND, badDep))).toBe(false);
  });

  it("maps slack onto ok, tight, missed, and invalid", () => {
    const ok = makeFlight("CX250", "CX", "HKG", "LHR", addMinutesIso(ARR, 180), addMinutesIso(ARR, 960));
    const tight = makeFlight("CX251", "CX", "HKG", "LHR", addMinutesIso(ARR, 70), addMinutesIso(ARR, 850));
    const missed = makeFlight("CX252", "CX", "HKG", "LHR", addMinutesIso(ARR, 40), addMinutesIso(ARR, 820));
    const invalid = makeFlight("CX253", "CX", "TPE", "LHR", ARR, ARR);
    expect(connectionStatus(makeConnection(INBOUND, ok))).toBe("ok");
    expect(isAtRisk(makeConnection(INBOUND, ok))).toBe(false);
    expect(connectionStatus(makeConnection(INBOUND, tight))).toBe("tight");
    expect(isAtRisk(makeConnection(INBOUND, tight))).toBe(true);
    expect(connectionStatus(makeConnection(INBOUND, missed))).toBe("missed");
    expect(isAtRisk(makeConnection(INBOUND, missed))).toBe(true);
    expect(connectionStatus(makeConnection(INBOUND, invalid))).toBe("invalid");
    expect(isAtRisk(makeConnection(INBOUND, invalid))).toBe(false);
  });
});
