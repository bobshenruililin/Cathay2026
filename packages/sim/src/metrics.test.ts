import { describe, expect, it } from "vitest";
import { isUnaccompaniedMinor, needsWheelchair, partySizeOf } from "engine";
import { createSimulation, CX254_DELAY_MINUTES, DEMO_SEED } from "./simulation.ts";
import { demoMetrics } from "./metrics.ts";

const LOCKED = {
  seed: "hkg-demo",
  connectionCount: 300,
  flightCount: 120,
  inboundCount: 50,
  baselineAtRisk: 124,
  baselineOptions: 62,
  typhoonDelayMinutes: 90,
  typhoonAtRisk: 176,
  typhoonOptions: 59,
  typhoonDelayedInbounds: 50,
  cx254DelayMinutes: 180,
  cx254AtRisk: 130,
  cx254Options: 61,
  umAtRisk: 11,
  umAtRiskKeptOnCx: 11,
};

describe("demo metrics from sim", () => {
  it("locks docs/METRICS.md arithmetic for the demo seed", () => {
    expect(demoMetrics(DEMO_SEED)).toEqual(LOCKED);
    expect(demoMetrics(DEMO_SEED)).toEqual(demoMetrics(DEMO_SEED));
  });

  it("queues named desk UM W4N9KD only after the CX254 delay", () => {
    const sim = createSimulation(DEMO_SEED);
    const baseline = sim.getState();
    const flagged = baseline.connections.filter((row) => {
      if (!baseline.atRisk.some((item) => item.pnr === row.passenger.pnr)) return false;
      const passenger = row.passenger;
      return (
        isUnaccompaniedMinor(passenger) ||
        needsWheelchair(passenger) ||
        partySizeOf(passenger) > 1
      );
    });
    expect(flagged.length).toBeGreaterThan(0);
    expect(baseline.atRisk.some((row) => row.pnr === "W4N9KD")).toBe(false);
    sim.injectFlightDelay("CX254", CX254_DELAY_MINUTES);
    const after = sim.getState();
    expect(after.atRisk.some((row) => row.pnr === "W4N9KD")).toBe(true);
    expect(after.connections.find((row) => row.passenger.pnr === "W4N9KD")?.passenger.um).toBe(true);
  });
});
