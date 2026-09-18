import { addMinutesIso } from "../src/iso";
import { makeConnection, makeFlight, makePassenger } from "../src/fixtures";
import type { Flight } from "../src/types";
import { cloneConnection, cloneFlight } from "./canonical";
import { ARR, RECIPES, coverageFlights } from "./cases";

export const SEEDS = [2026_11_16, 2026_11_17, 0x9e3779b9, 42, 7, 99] as const;
export const POOL_EXTRA = 24;

export type MatrixCell = {
  id: string;
  seed: number;
  connection: ReturnType<typeof makeConnection>;
  pool: Flight[];
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededFlights(seed: number): Flight[] {
  const rng = mulberry32(seed);
  const airlines = ["CX", "UO", "BA", "QF", "JL", "AA", "5J"];
  const statuses: Flight["status"][] = ["scheduled", "delayed", "arrived", "departed"];
  const pool: Flight[] = [];
  for (let i = 0; i < POOL_EXTRA; i++) {
    const airline = airlines[Math.floor(rng() * airlines.length)]!;
    const dest = rng() < 0.15 ? "SYD" : "LHR";
    const band = rng();
    const offset = band < 0.45 ? 50 + Math.floor(rng() * 180) : band < 0.75 ? 200 + Math.floor(rng() * 200) : 20 * 60 + Math.floor(rng() * 180);
    const dep = addMinutesIso(ARR, offset);
    const arr = addMinutesIso(ARR, offset + 780);
    const seats = {
      First: rng() < 0.5 ? 0 : 1 + Math.floor(rng() * 4),
      Business: Math.floor(rng() * 18),
      "Premium Economy": Math.floor(rng() * 24),
      Economy: 4 + Math.floor(rng() * 140),
    };
    pool.push({
      ...makeFlight(`${airline}${300 + i}`, airline, "HKG", dest, dep, arr, seats),
      gate: String(10 + Math.floor(rng() * 50)),
      delayMinutes: Math.floor(rng() * 40),
      status: statuses[Math.floor(rng() * statuses.length)]!,
    });
  }
  return pool;
}

function inboundFor(recipe: (typeof RECIPES)[number], seed: number): Flight {
  const arr = ARR;
  const dep = addMinutesIso(arr, -120);
  return {
    ...makeFlight(recipe.inboundNum, recipe.inboundAirline, recipe.inboundOrigin, "HKG", dep, arr),
    gate: String(1 + (seed % 17)),
    delayMinutes: seed % 9,
    status: seed % 2 === 0 ? "arrived" : "delayed",
  };
}

function outboundFor(recipe: (typeof RECIPES)[number], seed: number): Flight {
  const dep = addMinutesIso(ARR, recipe.slack);
  const arr = addMinutesIso(ARR, recipe.slack + 780);
  const origin = recipe.id === "invalid" ? "TPE" : "HKG";
  const dest = recipe.dest ?? "LHR";
  return {
    ...makeFlight(recipe.outboundNum, recipe.outboundAirline, origin, dest, dep, arr),
    gate: String(20 + (seed % 11)),
    delayMinutes: 0,
    status: "scheduled",
  };
}

/** New object identities every call. Field values are a pure function of SEEDS × RECIPES. */
export function freshMatrix(): MatrixCell[] {
  const cells: MatrixCell[] = [];
  for (const seed of SEEDS) {
    const proto = [...coverageFlights(), ...seededFlights(seed)];
    for (const recipe of RECIPES) {
      cells.push({
        id: `${seed}:${recipe.id}`,
        seed,
        connection: cloneConnection(makeConnection(inboundFor(recipe, seed), outboundFor(recipe, seed), recipe.pax())),
        pool: proto.map(cloneFlight),
      });
    }
  }
  return cells;
}

export function extraTransitShapes(): ReturnType<typeof makePassenger>[] {
  return [
    makePassenger("A"),
    makePassenger("B", "Gold", "Business", { um: true }),
    makePassenger("C", "Gold", "Business", { wheelchair: true }),
    makePassenger("D", "Gold", "Business", { um: true, wheelchair: true }),
    makePassenger("E", "Gold", "Business", { ssr: ["UMNR"] }),
    makePassenger("F", "Gold", "Business", { ssr: ["WCHR"] }),
    makePassenger("G", "Gold", "Business", { ssr: ["WCHS"] }),
    makePassenger("H", "Gold", "Business", { ssr: ["WCHC"] }),
    makePassenger("I", "Gold", "Business", { ssr: ["UMNR", "WCHS"] }),
    makePassenger("J", "Gold", "Business", { partySize: 4, partyId: "COLE" }),
  ];
}

export const CARRIERS = ["CX", "UO", "BA", "QF", "JL", "AA", "5J"] as const;
