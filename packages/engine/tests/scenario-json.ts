import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { CabinSeats, Connection, ConnectionStatus, Flight, Passenger } from "../src/types";

export type CompactFlight = {
  flightNumber: string;
  airline: string;
  origin?: string;
  destination?: string;
  depart?: string;
  arrive?: string;
  delayMinutes?: number;
  seats?: Partial<CabinSeats>;
};

export type ScenarioFixture = {
  id: string;
  title: string;
  story: string;
  tags: string[];
  passenger: Passenger;
  inbound: CompactFlight;
  outbound: CompactFlight;
  pool: CompactFlight[];
  expected: {
    status: ConnectionStatus;
    atRisk: boolean;
    feasible?: boolean;
    optionFlightNumbers: string[];
    triageReasoningIncludes?: string[];
    optionReasoningIncludes?: string[];
  };
};

const FULL: CabinSeats = {
  First: 4,
  Business: 20,
  "Premium Economy": 24,
  Economy: 140,
};

const IN_DEP = "2026-11-16T16:00:00+08:00";
const IN_ARR = "2026-11-16T18:00:00+08:00";
const OUT_DEP = "2026-11-16T19:10:00+08:00";
const OUT_ARR = "2026-11-17T06:00:00+08:00";

function seatsOf(partial?: Partial<CabinSeats>): CabinSeats {
  if (!partial) return { ...FULL };
  return { First: 0, Business: 0, "Premium Economy": 0, Economy: 0, ...partial };
}

export function hydrateFlight(slice: CompactFlight, role: "in" | "out"): Flight {
  const inbound = role === "in";
  const dep = slice.depart ?? (inbound ? IN_DEP : OUT_DEP);
  const arr = slice.arrive ?? (inbound ? IN_ARR : OUT_ARR);
  return {
    flightNumber: slice.flightNumber,
    airline: slice.airline,
    origin: slice.origin ?? (inbound ? "TPE" : "HKG"),
    destination: slice.destination ?? (inbound ? "HKG" : "LHR"),
    scheduledDeparture: dep,
    scheduledArrival: arr,
    actualDeparture: dep,
    actualArrival: arr,
    delayMinutes: slice.delayMinutes ?? 0,
    status: slice.delayMinutes && slice.delayMinutes > 0 ? "delayed" : "scheduled",
    gate: inbound ? "1" : "15",
    seats: seatsOf(slice.seats),
  };
}

export function hydrateConnection(fixture: ScenarioFixture): Connection {
  return {
    inbound: hydrateFlight(fixture.inbound, "in"),
    outbound: hydrateFlight(fixture.outbound, "out"),
    passenger: fixture.passenger,
  };
}

export function loadScenarioFiles(): ScenarioFixture[] {
  const dir = join(dirname(fileURLToPath(import.meta.url)), "scenarios");
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(readFileSync(join(dir, name), "utf8")) as ScenarioFixture);
}
