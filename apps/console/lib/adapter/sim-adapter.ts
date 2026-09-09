import { createSimulation, CX254_DELAY_MINUTES, DEMO_SEED, type Simulation } from "sim";
import { triageConnection } from "engine";
import { disruptionFrom, flightsByNumber, sortQueue } from "./queue";
import type { ConsoleAdapter, ConsoleSnapshot, QueueItem } from "./types";

export { DEMO_SEED };

function snapshotFrom(sim: Simulation, resolved: Set<string>): ConsoleSnapshot {
  const state = sim.getState();
  const lookup = flightsByNumber(state.flights);
  const queue: QueueItem[] = [];
  for (const row of state.connections) {
    if (resolved.has(row.passenger.pnr)) continue;
    const inbound = lookup.get(row.inboundFlightNumber);
    const outbound = lookup.get(row.outboundFlightNumber);
    if (!inbound || !outbound) continue;
    const result = triageConnection({ inbound, outbound, passenger: row.passenger }, state.flights);
    if (!result.atRisk) continue;
    queue.push({ result, passenger: row.passenger, inbound, outbound });
  }
  return {
    clockIso: state.clockIso,
    flights: state.flights,
    queue: sortQueue(queue),
    disruption: disruptionFrom(queue, state.flights),
  };
}

function cx254Inbound(sim: Simulation) {
  const flights = sim.getState().flights;
  const named = flights.find((flight) => flight.flightNumber === "CX254" && flight.destination === "HKG");
  const fallback = flights.find((flight) => flight.destination === "HKG");
  const inbound = named ?? fallback;
  if (!inbound) throw new Error("No inbound flight available for Late Inbound CX254");
  return inbound;
}

/** Live console path: seeded sim clock/delays + engine triage/options. */
export function createSimAdapter(): ConsoleAdapter {
  const sim = createSimulation(DEMO_SEED);
  const resolved = new Set<string>();

  return {
    async load() {
      return snapshotFrom(sim, resolved);
    },
    async advanceClock(minutes: number) {
      sim.advanceClock(minutes);
      return snapshotFrom(sim, resolved);
    },
    async injectDelay(flightNumber: string, delayMinutes: number) {
      sim.injectFlightDelay(flightNumber, delayMinutes);
      return snapshotFrom(sim, resolved);
    },
    async simulateTyphoonDelay() {
      sim.injectTyphoon();
      return snapshotFrom(sim, resolved);
    },
    async lateInboundCx254() {
      sim.injectFlightDelay(cx254Inbound(sim).flightNumber, CX254_DELAY_MINUTES);
      return snapshotFrom(sim, resolved);
    },
    async approveRebooking(pnr: string) {
      resolved.add(pnr);
      return snapshotFrom(sim, resolved);
    },
  };
}
