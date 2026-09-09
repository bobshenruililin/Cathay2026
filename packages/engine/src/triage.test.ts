import { describe, expect, it } from "vitest";
import { addMinutesIso } from "./iso";
import { triageConnection } from "./triage";
import { INBOUND, makeConnection, makeFlight, makePassenger } from "./fixtures";

const ARR = INBOUND.actualArrival;

describe("triage", () => {
  it("marks a healthy connection ok without generating options", () => {
    const outbound = makeFlight(
      "CX250",
      "CX",
      "HKG",
      "LHR",
      addMinutesIso(ARR, 180),
      addMinutesIso(ARR, 960),
    );
    const result = triageConnection(makeConnection(INBOUND, outbound), []);
    expect(result.status).toBe("ok");
    expect(result.feasible).toBe(true);
    expect(result.atRisk).toBe(false);
    expect(result.options).toEqual([]);
    expect(result.reasoning.join(" ")).toMatch(/healthy/);
  });

  it("marks a tight connection at-risk", () => {
    const outbound = makeFlight(
      "CX250",
      "CX",
      "HKG",
      "LHR",
      addMinutesIso(ARR, 70),
      addMinutesIso(ARR, 850),
    );
    const result = triageConnection(makeConnection(INBOUND, outbound), []);
    expect(result.status).toBe("tight");
    expect(result.feasible).toBe(true);
    expect(result.atRisk).toBe(true);
    expect(result.reasoning.join(" ")).toMatch(/tight/);
  });

  it("marks a missed connection at-risk and offers partner alternatives", () => {
    const outbound = makeFlight(
      "CX250",
      "CX",
      "HKG",
      "LHR",
      addMinutesIso(ARR, 40),
      addMinutesIso(ARR, 820),
    );
    const partner = makeFlight(
      "BA32",
      "BA",
      "HKG",
      "LHR",
      addMinutesIso(ARR, 150),
      addMinutesIso(ARR, 930),
    );
    const result = triageConnection(makeConnection(INBOUND, outbound), [partner]);
    expect(result.status).toBe("missed");
    expect(result.feasible).toBe(false);
    expect(result.atRisk).toBe(true);
    expect(result.options[0]?.flight.flightNumber).toBe("BA32");
    expect(result.reasoning.join(" ")).toMatch(/missed/);
  });

  it("returns invalid without options", () => {
    const outbound = makeFlight("CX250", "CX", "TPE", "LHR", ARR, ARR);
    const result = triageConnection(makeConnection(INBOUND, outbound, makePassenger("ZZZ")));
    expect(result.status).toBe("invalid");
    expect(result.atRisk).toBe(false);
    expect(result.pnr).toBe("ZZZ");
    expect(result.options).toEqual([]);
  });
});
