import { describe, expect, it } from "vitest";
import { DEMO_SEED } from "./simulation.ts";
import { demoMetrics } from "./metrics.ts";

const LOCKED = {
  seed: "hkg-demo",
  connectionCount: 300,
  flightCount: 120,
  inboundCount: 50,
  baselineAtRisk: 124,
  baselineOptions: 62,
  typhoonDelayMinutes: 90,
  typhoonAtRisk: 174,
  typhoonOptions: 59,
  typhoonDelayedInbounds: 50,
  cx254DelayMinutes: 180,
  cx254AtRisk: 130,
  cx254Options: 61,
  umAtRisk: 10,
  umAtRiskKeptOnCx: 10,
};

describe("demo metrics from sim", () => {
  it("locks docs/METRICS.md arithmetic for the demo seed", () => {
    expect(demoMetrics(DEMO_SEED)).toEqual(LOCKED);
    expect(demoMetrics(DEMO_SEED)).toEqual(demoMetrics(DEMO_SEED));
  });
});
