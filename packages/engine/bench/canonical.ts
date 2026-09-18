import { createHash } from "node:crypto";
import type {
  CabinSeats,
  Connection,
  Flight,
  Passenger,
  RecoveryOption,
  TriageResult,
} from "../src/types";

export function cloneSeats(seats: CabinSeats): CabinSeats {
  return {
    First: seats.First,
    Business: seats.Business,
    "Premium Economy": seats["Premium Economy"],
    Economy: seats.Economy,
  };
}

export function cloneFlight(flight: Flight): Flight {
  return {
    flightNumber: flight.flightNumber,
    airline: flight.airline,
    origin: flight.origin,
    destination: flight.destination,
    scheduledDeparture: flight.scheduledDeparture,
    actualDeparture: flight.actualDeparture,
    scheduledArrival: flight.scheduledArrival,
    actualArrival: flight.actualArrival,
    delayMinutes: flight.delayMinutes,
    status: flight.status,
    gate: flight.gate,
    seats: cloneSeats(flight.seats),
  };
}

export function clonePassenger(passenger: Passenger): Passenger {
  return {
    pnr: passenger.pnr,
    name: passenger.name,
    tier: passenger.tier,
    cabin: passenger.cabin,
    um: passenger.um,
    wheelchair: passenger.wheelchair,
    ssr: passenger.ssr ? [...passenger.ssr] : undefined,
    partyId: passenger.partyId,
    partySize: passenger.partySize,
  };
}

export function cloneConnection(connection: Connection): Connection {
  return {
    inbound: cloneFlight(connection.inbound),
    outbound: cloneFlight(connection.outbound),
    passenger: clonePassenger(connection.passenger),
  };
}

export function observeFlight(flight: Flight) {
  return {
    airline: flight.airline,
    actualArrival: flight.actualArrival,
    actualDeparture: flight.actualDeparture,
    delayMinutes: flight.delayMinutes,
    destination: flight.destination,
    flightNumber: flight.flightNumber,
    gate: flight.gate,
    origin: flight.origin,
    scheduledArrival: flight.scheduledArrival,
    scheduledDeparture: flight.scheduledDeparture,
    seats: cloneSeats(flight.seats),
    status: flight.status,
  };
}

export function observePassenger(passenger: Passenger) {
  return {
    cabin: passenger.cabin,
    name: passenger.name,
    partyId: passenger.partyId ?? null,
    partySize: passenger.partySize ?? null,
    pnr: passenger.pnr,
    ssr: passenger.ssr ? [...passenger.ssr] : null,
    tier: passenger.tier,
    um: passenger.um ?? null,
    wheelchair: passenger.wheelchair ?? null,
  };
}

export function observeOption(option: RecoveryOption) {
  return {
    delayMinutes: option.delayMinutes,
    downgradeProtected: option.downgradeProtected,
    flight: observeFlight(option.flight),
    offeredCabin: option.offeredCabin,
    reasoning: [...option.reasoning],
    score: option.score,
    seatMatch: option.seatMatch,
  };
}

export function observeTriage(result: TriageResult) {
  return {
    atRisk: result.atRisk,
    feasible: result.feasible,
    inboundFlightNumber: result.inboundFlightNumber,
    options: result.options.map(observeOption),
    outboundFlightNumber: result.outboundFlightNumber,
    pnr: result.pnr,
    reasoning: [...result.reasoning],
    requiredMinutes: result.requiredMinutes,
    slackMinutes: result.slackMinutes,
    status: result.status,
  };
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) out[key] = sortKeys(record[key]);
    return out;
  }
  return value;
}

export function digest256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}
