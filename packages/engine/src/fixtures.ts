import type { CabinSeats, Connection, Flight, Passenger } from "./types";

const SEATS: CabinSeats = {
  First: 4,
  Business: 20,
  "Premium Economy": 24,
  Economy: 140,
};

export function makeFlight(
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  dep: string,
  arr: string,
  seats: CabinSeats = SEATS,
): Flight {
  return {
    flightNumber,
    airline,
    origin,
    destination,
    scheduledDeparture: dep,
    scheduledArrival: arr,
    actualDeparture: dep,
    actualArrival: arr,
    delayMinutes: 0,
    status: "scheduled",
    gate: "15",
    seats,
  };
}

export function makePassenger(
  pnr = "ABC123",
  tier: Passenger["tier"] = "Gold",
  cabin: Passenger["cabin"] = "Business",
  extras: Partial<Pick<Passenger, "um" | "wheelchair" | "partySize" | "name" | "ssr" | "partyId">> = {},
): Passenger {
  return {
    pnr,
    name: extras.name ?? "Test Passenger",
    tier,
    cabin,
    um: extras.um,
    wheelchair: extras.wheelchair,
    partySize: extras.partySize,
    ssr: extras.ssr,
    partyId: extras.partyId,
  };
}

export function makeConnection(
  inbound: Flight,
  outbound: Flight,
  passenger: Passenger = makePassenger(),
): Connection {
  return { inbound, outbound, passenger };
}

export const INBOUND = makeFlight(
  "CX401",
  "CX",
  "TPE",
  "HKG",
  "2026-11-16T16:00:00+08:00",
  "2026-11-16T18:00:00+08:00",
);
