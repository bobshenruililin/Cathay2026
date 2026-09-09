import { describe, expect, it } from "vitest";
import { isUnaccompaniedMinor, needsWheelchair, partySizeOf } from "engine";
import { createSimulation, CX254_DELAY_MINUTES, DEMO_SEED } from "./simulation.ts";
import { demoMetrics } from "./metrics.ts";

const LOCKED = {
  seed: "hkg-demo",
  connectionCount: 300,
  flightCount: 120,
  inboundCount: 50,
  baselineAtRisk: 122,
  baselineOptions: 57,
  typhoonDelayMinutes: 90,
  typhoonAtRisk: 175,
  typhoonOptions: 69,
  typhoonDelayedInbounds: 50,
  cx254DelayMinutes: 180,
  cx254AtRisk: 131,
  cx254Options: 65,
  umAtRisk: 13,
  umAtRiskKeptOnCx: 13,
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
    expect(after.atRisk.some((row) => row.pnr === "SSRUMNR")).toBe(true);
    expect(after.connections.find((row) => row.passenger.pnr === "SSRUMNR")?.passenger.ssr).toEqual([
      "UMNR",
    ]);
    expect(after.atRisk.some((row) => row.pnr === "MIXED4")).toBe(true);
    const mixed = after.atRisk.find((row) => row.pnr === "MIXED4");
    expect(mixed?.options.length).toBeGreaterThan(0);
    expect(mixed?.options.some((option) => option.flight.airline === "CX")).toBe(true);
    expect(mixed?.options.map((option) => option.reasoning.join(" ")).join(" ")).toContain("COLE");
    const first = after.atRisk.find((row) => row.pnr === "FIRST1");
    expect(first?.options.some((option) => option.downgradeProtected)).toBe(true);
    expect(first?.options.map((option) => option.reasoning.join(" ")).join(" ")).toContain("Hold Business instead");
  });
});
