import type { CabinClass, Flight, LoyaltyTier, Passenger } from "engine";
import { pick, rngInt, type Rng } from "./prng.ts";

export type BankConnection = {
  passenger: Passenger;
  inboundFlightNumber: string;
  outboundFlightNumber: string;
};

const FIRST = ["Wei", "Mei", "James", "Aisha", "Hiro", "Sofia", "Noah", "Priya", "Lucas", "Yuna"];
const LAST = ["Chan", "Wong", "Patel", "Tanaka", "Rossi", "Kim", "Garcia", "Nguyen", "Singh", "Brown"];
const TIERS: LoyaltyTier[] = ["Diamond", "Gold", "Silver", "Green"];
const CABINS: CabinClass[] = ["First", "Business", "Premium Economy", "Economy"];
const TIER_BAG: LoyaltyTier[] = ["Green", "Green", "Green", "Silver", "Silver", "Gold", "Diamond"];
const CABIN_BAG: CabinClass[] = ["Economy", "Economy", "Economy", "Premium Economy", "Business", "First"];
const PNR_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makePnr(rng: Rng, used: Set<string>): string {
  for (let attempt = 0; attempt < 32; attempt++) {
    let text = "";
    for (let i = 0; i < 6; i++) text += PNR_CHARS[rngInt(rng, PNR_CHARS.length)];
    if (!used.has(text)) {
      used.add(text);
      return text;
    }
  }
  const fallback = `Z${String(used.size).padStart(5, "0")}`;
  used.add(fallback);
  return fallback;
}

export function generateConnections(rng: Rng, flights: readonly Flight[]): BankConnection[] {
  const arrivals = flights.filter((f) => f.destination === "HKG");
  const departures = flights.filter((f) => f.origin === "HKG");
  const used = new Set<string>();
  const connections: BankConnection[] = [];
  for (let i = 0; i < 300; i++) {
    const inbound = arrivals[i % arrivals.length]!;
    let outbound = pick(rng, departures);
    if (outbound.destination === inbound.origin) {
      outbound = departures[(i + 7) % departures.length]!;
    }
    const tier = i < 4 ? TIERS[i]! : pick(rng, TIER_BAG);
    const cabin = i < 4 ? CABINS[i]! : pick(rng, CABIN_BAG);
    const passenger: Passenger = {
      pnr: makePnr(rng, used),
      name: `${pick(rng, FIRST)} ${pick(rng, LAST)}`,
      tier,
      cabin,
      um: i % 17 === 0,
      wheelchair: i % 13 === 0,
      partySize: i % 19 === 0 ? 4 : 1,
    };
    connections.push({
      passenger,
      inboundFlightNumber: inbound.flightNumber,
      outboundFlightNumber: outbound.flightNumber,
    });
  }
  return pinCx254Feeders(connections, flights);
}

/** Keep a few CX254 inbound links just above MCT so a 150 min delay puts them at risk. */
function pinCx254Feeders(connections: BankConnection[], flights: readonly Flight[]): BankConnection[] {
  const inbound = flights.find((flight) => flight.flightNumber === "CX254" && flight.destination === "HKG");
  if (!inbound) return connections;
  const arrival = Date.parse(inbound.actualArrival);
  const ranked = flights
    .filter((flight) => flight.origin === "HKG" && flight.destination !== inbound.origin)
    .map((flight) => ({
      flight,
      slack: (Date.parse(flight.actualDeparture) - arrival) / 60_000,
    }))
    .filter((row) => row.slack > 0)
    .sort((left, right) => Math.abs(left.slack - 180) - Math.abs(right.slack - 180));
  const outbound = ranked[0]?.flight;
  if (!outbound) return connections;
  return connections.map((row, index) =>
    index < connections.length - 4
      ? row
      : {
          ...row,
          inboundFlightNumber: inbound.flightNumber,
          outboundFlightNumber: outbound.flightNumber,
        },
  );
}
