import type { CabinClass, Flight, LoyaltyTier, Passenger } from "engine";
import { addMinutesIso } from "engine";
import { BANK_END_ISO } from "./catalog.ts";
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

/** Named JSON-case PNRs on the live CX254 feeder slots (mock bank names). */
const DESK_CASES: Passenger[] = [
  { pnr: "W4N9KD", name: "Mei Chan", tier: "Diamond", cabin: "Business", um: true },
  { pnr: "P8T2LM", name: "James Wong", tier: "Gold", cabin: "Premium Economy", wheelchair: true },
  { pnr: "Q1H6VB", name: "Aisha Patel", tier: "Silver", cabin: "Economy", partySize: 4, partyId: "PATEL" },
  { pnr: "SSRWCH", name: "Grace Ho", tier: "Gold", cabin: "Business", ssr: ["WCHR"] },
  { pnr: "SSRUMNR", name: "Mina Choi", tier: "Silver", cabin: "Economy", ssr: ["UMNR"] },
  { pnr: "MIXED4", name: "Cole Family", tier: "Gold", cabin: "Business", um: true, wheelchair: true, partySize: 4, partyId: "COLE" },
  { pnr: "FIRST1", name: "Elena Rossi", tier: "Diamond", cabin: "First" },
];

/** CX254 arrival plus this many minutes: 180 delay + 100 so MIXED4 (need 95) still catches CX metal. */
const DESK_RECOVERY_AFTER_ARRIVAL_MINUTES = 280;

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
  const used = new Set<string>(DESK_CASES.map((row) => row.pnr));
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
  return pinDeskCases(pinCx254Feeders(connections, flights));
}

/** Place CX390 on LHR after CX254 so named desk cases still have CX metal after the 180 min delay. */
export function pinDeskRecoveries(flights: readonly Flight[]): Flight[] {
  const inbound = flights.find((flight) => flight.flightNumber === "CX254" && flight.destination === "HKG");
  if (!inbound) return [...flights];
  const departure = addMinutesIso(inbound.actualArrival, DESK_RECOVERY_AFTER_ARRIVAL_MINUTES);
  if (Date.parse(departure) > Date.parse(BANK_END_ISO)) return [...flights];
  return flights.map((flight) =>
    flight.flightNumber !== "CX390"
      ? flight
      : {
          ...flight,
          destination: "LHR",
          scheduledDeparture: departure,
          actualDeparture: departure,
          scheduledArrival: addMinutesIso(departure, 780),
          actualArrival: addMinutesIso(departure, 780),
          seats: { ...flight.seats, First: 0 },
        },
  );
}

/** Keep named CX254 feeders on LHR just above MCT so a 180 min delay puts them at risk with recoveries. */
function pinCx254Feeders(connections: BankConnection[], flights: readonly Flight[]): BankConnection[] {
  const inbound = flights.find((flight) => flight.flightNumber === "CX254" && flight.destination === "HKG");
  if (!inbound) return connections;
  const arrival = Date.parse(inbound.actualArrival);
  const ranked = flights
    .filter((flight) => flight.origin === "HKG" && flight.destination === "LHR" && flight.airline === "CX")
    .map((flight) => ({
      flight,
      slack: (Date.parse(flight.actualDeparture) - arrival) / 60_000,
    }))
    .filter((row) => row.slack > 0)
    .sort((left, right) => Math.abs(left.slack - 180) - Math.abs(right.slack - 180));
  const outbound = ranked[0]?.flight;
  if (!outbound) return connections;
  return connections.map((row, index) =>
    index < connections.length - DESK_CASES.length
      ? row
      : {
          ...row,
          inboundFlightNumber: inbound.flightNumber,
          outboundFlightNumber: outbound.flightNumber,
        },
  );
}

function pinDeskCases(connections: BankConnection[]): BankConnection[] {
  const start = connections.length - DESK_CASES.length;
  if (start < 0) return connections;
  return connections.map((row, index) => {
    const passenger = DESK_CASES[index - start];
    return passenger ? { ...row, passenger } : row;
  });
}
