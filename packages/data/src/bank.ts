import type { Flight } from "engine";
import { generateFlights } from "./flights.ts";
import { generateConnections, pinDeskRecoveries, type BankConnection } from "./passengers.ts";
import { createPrng } from "./prng.ts";

export type EveningBank = {
  seed: string;
  flights: Flight[];
  connections: BankConnection[];
};

export function generateEveningBank(seed: string | number): EveningBank {
  const rng = createPrng(seed);
  const flights = pinDeskRecoveries(generateFlights(rng));
  const connections = generateConnections(rng, flights);
  return { seed: String(seed), flights, connections };
}
