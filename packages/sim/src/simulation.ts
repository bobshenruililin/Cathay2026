import { addMinutesIso, triageConnection } from "engine";
import type { Flight, FlightStatus, TriageResult } from "engine";
import { BANK_START_ISO, generateEveningBank, type BankConnection } from "data";

export type SimEvent =
  | { type: "clock"; clockIso: string; reasoning: string[] }
  | { type: "flight_status"; flight: Flight; reasoning: string[] }
  | { type: "newly_at_risk"; result: TriageResult };

export type SimState = {
  seed: string;
  clockIso: string;
  flights: Flight[];
  connections: BankConnection[];
  atRisk: TriageResult[];
};

export type Simulation = {
  advanceClock: (minutes: number) => SimEvent[];
  injectFlightDelay: (flightNumber: string, delayMinutes: number) => SimEvent[];
  getState: () => SimState;
  subscribe: (listener: (event: SimEvent) => void) => () => void;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function deriveStatus(flight: Flight, clockIso: string): FlightStatus {
  const clock = Date.parse(clockIso);
  if (clock >= Date.parse(flight.actualArrival)) return "arrived";
  if (clock >= Date.parse(flight.actualDeparture)) return "departed";
  if (flight.delayMinutes > 0) return "delayed";
  return "scheduled";
}

function withStatuses(flights: Flight[], clockIso: string): Flight[] {
  return flights.map((flight) => ({ ...flight, status: deriveStatus(flight, clockIso) }));
}

function evaluateAtRisk(flights: Flight[], connections: BankConnection[]): TriageResult[] {
  const byNumber = new Map(flights.map((flight) => [flight.flightNumber, flight]));
  const atRisk: TriageResult[] = [];
  for (const row of connections) {
    const inbound = byNumber.get(row.inboundFlightNumber);
    const outbound = byNumber.get(row.outboundFlightNumber);
    if (!inbound || !outbound) continue;
    const result = triageConnection({ inbound, outbound, passenger: row.passenger }, flights);
    if (result.atRisk) atRisk.push(result);
  }
  return atRisk;
}

export function createSimulation(seed: string | number): Simulation {
  const bank = generateEveningBank(seed);
  let clockIso = BANK_START_ISO;
  let flights = withStatuses(clone(bank.flights), clockIso);
  const connections = clone(bank.connections);
  let atRisk = evaluateAtRisk(flights, connections);
  const listeners = new Set<(event: SimEvent) => void>();

  function snapshot(): SimState {
    return clone({ seed: String(seed), clockIso, flights, connections, atRisk });
  }

  function emitAll(events: SimEvent[]): void {
    for (const event of events) {
      for (const listener of listeners) listener(event);
    }
  }

  function publishAtRisk(previous: TriageResult[], events: SimEvent[]): void {
    const seen = new Set(previous.map((row) => row.pnr));
    atRisk = evaluateAtRisk(flights, connections);
    for (const result of atRisk) {
      if (seen.has(result.pnr)) continue;
      events.push({ type: "newly_at_risk", result });
    }
  }

  function applyStatuses(events: SimEvent[]): void {
    const previous = new Map(flights.map((flight) => [flight.flightNumber, flight.status]));
    flights = withStatuses(flights, clockIso);
    for (const flight of flights) {
      if (previous.get(flight.flightNumber) === flight.status) continue;
      events.push({
        type: "flight_status",
        flight,
        reasoning: [`${flight.flightNumber} is now ${flight.status} at ${clockIso}.`],
      });
    }
  }

  return {
    getState: snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    advanceClock(minutes: number) {
      if (minutes < 0) throw new Error("advanceClock does not accept negative minutes");
      clockIso = addMinutesIso(clockIso, minutes);
      const events: SimEvent[] = [
        { type: "clock", clockIso, reasoning: [`Clock advanced ${minutes} minutes to ${clockIso}.`] },
      ];
      const previousAtRisk = atRisk;
      applyStatuses(events);
      publishAtRisk(previousAtRisk, events);
      emitAll(events);
      return events;
    },
    injectFlightDelay(flightNumber: string, delayMinutes: number) {
      const index = flights.findIndex((flight) => flight.flightNumber === flightNumber);
      if (index < 0) throw new Error(`Unknown flight ${flightNumber}`);
      const current = flights[index]!;
      const delay = current.delayMinutes + delayMinutes;
      const updated: Flight = {
        ...current,
        delayMinutes: delay,
        actualDeparture: addMinutesIso(current.scheduledDeparture, delay),
        actualArrival: addMinutesIso(current.scheduledArrival, delay),
      };
      updated.status = deriveStatus(updated, clockIso);
      flights = flights.map((flight, i) => (i === index ? updated : flight));
      const events: SimEvent[] = [
        {
          type: "flight_status",
          flight: updated,
          reasoning: [`${flightNumber} delayed ${delayMinutes} minutes (total ${delay}).`],
        },
      ];
      publishAtRisk(atRisk, events);
      emitAll(events);
      return events;
    },
  };
}
