import { addMinutesIso, formatHkgIso } from "engine";
import type { CabinSeats, Flight } from "engine";
import {
  BANK_START_ISO,
  CX_INBOUND,
  CX_OUTBOUND,
  ONEWORLD_DEPARTURES,
  UO_CITIES,
  type CityHop,
} from "./catalog.ts";
import { rngInt, type Rng } from "./prng.ts";

const BANK_START_MS = Date.parse(BANK_START_ISO);

function offsetIso(minOffset: number, maxOffset: number, rng: Rng): string {
  const offset = minOffset + rngInt(rng, maxOffset - minOffset + 1);
  return formatHkgIso(BANK_START_MS + offset * 60_000);
}

function seatsFor(airline: string, longhaul: boolean, rng: Rng): CabinSeats {
  if (airline === "UO") {
    return { First: 0, Business: 0, "Premium Economy": 0, Economy: 80 + rngInt(rng, 80) };
  }
  return {
    First: longhaul ? rngInt(rng, 9) : 0,
    Business: 8 + rngInt(rng, 32),
    "Premium Economy": longhaul ? 8 + rngInt(rng, 24) : 0,
    Economy: 80 + rngInt(rng, 120),
  };
}

function buildFlight(
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  departure: string,
  blockMinutes: number,
  longhaul: boolean,
  rng: Rng,
): Flight {
  return {
    flightNumber,
    airline,
    origin,
    destination,
    scheduledDeparture: departure,
    scheduledArrival: addMinutesIso(departure, blockMinutes),
    actualDeparture: departure,
    actualArrival: addMinutesIso(departure, blockMinutes),
    delayMinutes: 0,
    status: "scheduled",
    gate: `${1 + rngInt(rng, 6)}${rngInt(rng, 10)}${rngInt(rng, 10)}`,
    seats: seatsFor(airline, longhaul, rng),
  };
}

function inboundFlight(
  flightNumber: string,
  airline: string,
  hop: CityHop,
  minOff: number,
  maxOff: number,
  rng: Rng,
): Flight {
  const arrival = offsetIso(minOff, maxOff, rng);
  const departure = addMinutesIso(arrival, -hop.blockMinutes);
  return {
    ...buildFlight(flightNumber, airline, hop.city, "HKG", departure, hop.blockMinutes, hop.longhaul, rng),
    scheduledArrival: arrival,
    actualArrival: arrival,
  };
}

export function generateFlights(rng: Rng): Flight[] {
  const flights: Flight[] = [];
  for (let i = 0; i < 40; i++) {
    const hop = CX_INBOUND[i % CX_INBOUND.length]!;
    flights.push(inboundFlight(`CX${100 + i}`, "CX", hop, 0, 300, rng));
  }
  for (let i = 0; i < 40; i++) {
    const hop = CX_OUTBOUND[i % CX_OUTBOUND.length]!;
    const dep = offsetIso(90, 480, rng);
    flights.push(buildFlight(`CX${250 + i}`, "CX", "HKG", hop.city, dep, hop.blockMinutes, hop.longhaul, rng));
  }
  for (let i = 0; i < 10; i++) {
    const hop = UO_CITIES[i]!;
    flights.push(inboundFlight(`UO${100 + i}`, "UO", hop, 0, 300, rng));
  }
  for (let i = 0; i < 10; i++) {
    const hop = UO_CITIES[i]!;
    const dep = offsetIso(90, 480, rng);
    flights.push(buildFlight(`UO${200 + i}`, "UO", "HKG", hop.city, dep, hop.blockMinutes, hop.longhaul, rng));
  }
  for (const partner of ONEWORLD_DEPARTURES) {
    const dep = offsetIso(90, 480, rng);
    flights.push(
      buildFlight(
        partner.flightNumber,
        partner.airline,
        "HKG",
        partner.city,
        dep,
        partner.blockMinutes,
        partner.longhaul,
        rng,
      ),
    );
  }
  return flights;
}
