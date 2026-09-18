import {
  extraTransitMinutes,
  generateOptions,
  requiredMinutes,
  requiredMinutesFor,
  triageConnection,
} from "../src/index";
import { addMinutesIso } from "../src/iso";
import { INBOUND, makeConnection, makeFlight, makePassenger } from "../src/fixtures";
import type { Connection, Flight, Passenger, RecoveryOption, TriageResult } from "../src/types";

export const SEED = 2026_11_16;
export const POOL_SIZE = 240;

/** Locked after the first honest bench run. Drift means outputs changed. */
export const GOLDEN = {
  requiredMinutes: "1d696aad",
  extraTransit: "e1d1882d",
  triageConnection: "bd4fe690",
  generateOptions: "a0d8ac93",
} as const;

export type KernelName = keyof typeof GOLDEN;

export function hashText(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = (h << 5) + h + text.charCodeAt(i);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

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

function buildPool(rng: () => number, size: number): Flight[] {
  const airlines = ["CX", "UO", "BA", "QF", "JL", "AA", "5J"];
  const pool: Flight[] = [];
  const arr = INBOUND.actualArrival;
  for (let i = 0; i < size; i++) {
    const airline = airlines[Math.floor(rng() * airlines.length)]!;
    const dest = rng() < 0.12 ? "SYD" : "LHR";
    const offset = 40 + Math.floor(rng() * 1600);
    const seats = {
      First: rng() < 0.45 ? 0 : 4,
      Business: Math.floor(rng() * 20),
      "Premium Economy": Math.floor(rng() * 24),
      Economy: 20 + Math.floor(rng() * 140),
    };
    pool.push(
      makeFlight(
        `${airline}${100 + i}`,
        airline,
        "HKG",
        dest,
        addMinutesIso(arr, offset),
        addMinutesIso(arr, offset + 780),
        seats,
      ),
    );
  }
  return pool;
}

function missed(extras: Partial<Pick<Passenger, "um" | "wheelchair" | "ssr" | "partySize" | "partyId">> = {}): Connection {
  const outbound = makeFlight(
    "CX250",
    "CX",
    "HKG",
    "LHR",
    addMinutesIso(INBOUND.actualArrival, 40),
    addMinutesIso(INBOUND.actualArrival, 820),
  );
  return makeConnection(INBOUND, outbound, makePassenger("BENCH", "Diamond", "Business", extras));
}

function fpOption(option: RecoveryOption): string {
  return [
    option.flight.flightNumber,
    option.score,
    option.delayMinutes,
    option.seatMatch,
    option.offeredCabin,
    option.downgradeProtected,
    option.reasoning.join("|"),
  ].join("/");
}

function fpTriage(result: TriageResult): string {
  return [
    result.pnr,
    result.status,
    result.slackMinutes,
    result.requiredMinutes,
    result.reasoning.join("|"),
    result.options.map(fpOption).join(";"),
  ].join("/");
}

const AIRLINES = ["CX", "UO", "BA", "QF", "5J"] as const;

export function fingerprintRequiredMinutes(): string {
  const parts: string[] = [];
  for (const inbound of AIRLINES) {
    for (const outbound of AIRLINES) {
      parts.push(
        `${inbound}-${outbound}:${requiredMinutes(inbound, outbound)}:${requiredMinutesFor(inbound, outbound, { um: true, wheelchair: true })}`,
      );
    }
  }
  return hashText(parts.join(","));
}

export function fingerprintExtraTransit(): string {
  const shapes: Passenger[] = [
    makePassenger("A"),
    makePassenger("B", "Gold", "Business", { um: true }),
    makePassenger("C", "Gold", "Business", { wheelchair: true }),
    makePassenger("D", "Gold", "Business", { um: true, wheelchair: true }),
    makePassenger("E", "Gold", "Business", { ssr: ["UMNR"] }),
    makePassenger("F", "Gold", "Business", { ssr: ["WCHR"] }),
    makePassenger("G", "Gold", "Business", { ssr: ["UMNR", "WCHS"] }),
    makePassenger("H", "Gold", "Business", { partySize: 4, partyId: "COLE" }),
  ];
  return hashText(shapes.map((pax) => `${pax.pnr}:${extraTransitMinutes(pax)}`).join(","));
}

export function loadWorkload(): { name: KernelName; run: () => string }[] {
  const pool = buildPool(mulberry32(SEED), POOL_SIZE);
  const connections = [
    missed(),
    missed({ um: true }),
    missed({ wheelchair: true }),
    missed({ um: true, wheelchair: true, partySize: 4, partyId: "COLE" }),
    missed({ ssr: ["UMNR"] }),
    missed({ ssr: ["WCHR"], partySize: 2 }),
  ];
  return [
    { name: "requiredMinutes", run: fingerprintRequiredMinutes },
    { name: "extraTransit", run: fingerprintExtraTransit },
    {
      name: "triageConnection",
      run: () => hashText(connections.map((row) => fpTriage(triageConnection(row, pool))).join("||")),
    },
    {
      name: "generateOptions",
      run: () =>
        hashText(connections.map((row) => generateOptions(row, pool).map(fpOption).join(";")).join("||")),
    },
  ];
}
