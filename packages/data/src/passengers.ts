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
    };
    connections.push({
      passenger,
      inboundFlightNumber: inbound.flightNumber,
      outboundFlightNumber: outbound.flightNumber,
    });
  }
  return connections;
}
