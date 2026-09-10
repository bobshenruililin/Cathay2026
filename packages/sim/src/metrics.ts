import { isUnaccompaniedMinor } from "engine";
import {
  createSimulation,
  CX254_DELAY_MINUTES,
  DEMO_SEED,
  TYPHOON_DELAY_MINUTES,
  type SimState,
} from "./simulation.ts";

export type DemoMetrics = {
  seed: string;
  connectionCount: number;
  flightCount: number;
  inboundCount: number;
  baselineAtRisk: number;
  baselineOptions: number;
  typhoonDelayMinutes: number;
  typhoonAtRisk: number;
  typhoonOptions: number;
  typhoonDelayedInbounds: number;
  cx254DelayMinutes: number;
  cx254AtRisk: number;
  cx254Options: number;
  umAtRisk: number;
  umAtRiskKeptOnCx: number;
};

function optionCount(state: SimState): number {
  return state.atRisk.reduce((n, row) => n + row.options.length, 0);
}

function umCounts(state: SimState): { umAtRisk: number; umAtRiskKeptOnCx: number } {
  let umAtRisk = 0;
  let umAtRiskKeptOnCx = 0;
  for (const row of state.connections) {
    if (!isUnaccompaniedMinor(row.passenger)) continue;
    const result = state.atRisk.find((item) => item.pnr === row.passenger.pnr);
    if (!result) continue;
    umAtRisk += 1;
    if (result.options.every((option) => option.flight.airline === "CX")) {
      umAtRiskKeptOnCx += 1;
    }
  }
  return { umAtRisk, umAtRiskKeptOnCx };
}

/** Arithmetic for docs/METRICS.md. Same seed → same counts. Never vendor ROI. */
export function demoMetrics(seed: string = DEMO_SEED): DemoMetrics {
  const baseline = createSimulation(seed).getState();
  const typhoonSim = createSimulation(seed);
  typhoonSim.injectTyphoon();
  const typhoon = typhoonSim.getState();
  const cxSim = createSimulation(seed);
  cxSim.injectFlightDelay("CX254", CX254_DELAY_MINUTES);
  const cx254 = cxSim.getState();
  const um = umCounts(typhoon);
  return {
    seed: String(seed),
    connectionCount: baseline.connections.length,
    flightCount: baseline.flights.length,
    inboundCount: baseline.flights.filter((flight) => flight.destination === "HKG").length,
    baselineAtRisk: baseline.atRisk.length,
    baselineOptions: optionCount(baseline),
    typhoonDelayMinutes: TYPHOON_DELAY_MINUTES,
    typhoonAtRisk: typhoon.atRisk.length,
    typhoonOptions: optionCount(typhoon),
    typhoonDelayedInbounds: typhoon.flights.filter(
      (flight) => flight.destination === "HKG" && flight.delayMinutes > 0,
    ).length,
    cx254DelayMinutes: CX254_DELAY_MINUTES,
    cx254AtRisk: cx254.atRisk.length,
    cx254Options: optionCount(cx254),
    umAtRisk: um.umAtRisk,
    umAtRiskKeptOnCx: um.umAtRiskKeptOnCx,
  };
}
