import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  generateOptions,
  hkgCalendarDay,
  isAtRisk,
  isOneworldAirline,
  isUnaccompaniedMinor,
  minutesBetween,
  partySeating,
  requiredMinutesFor,
  scoreOption,
} from "../src/index";
import { addMinutesIso } from "../src/iso";
import { INBOUND, makeConnection, makeFlight, makePassenger } from "../src/fixtures";
import type { Connection, Flight, LoyaltyTier } from "../src/types";

const ARR = INBOUND.actualArrival;
const TIERS: LoyaltyTier[] = ["Diamond", "Gold", "Silver", "Green"];

function isViablePublic(connection: Connection, candidate: Flight): boolean {
  if (candidate.flightNumber === connection.outbound.flightNumber) return false;
  if (candidate.origin !== "HKG" || candidate.destination !== connection.outbound.destination) return false;
  if (isUnaccompaniedMinor(connection.passenger) && candidate.airline !== "CX") return false;
  if (
    isUnaccompaniedMinor(connection.passenger) &&
    hkgCalendarDay(candidate.actualDeparture) !== hkgCalendarDay(connection.outbound.actualDeparture)
  ) {
    return false;
  }
  if (!partySeating(candidate, connection.passenger)) return false;
  const available = minutesBetween(connection.inbound.actualArrival, candidate.actualDeparture);
  return available >= requiredMinutesFor(connection.inbound.airline, candidate.airline, connection.passenger);
}

function scoreOf(connection: Connection, flight: Flight): number {
  const seating = partySeating(flight, connection.passenger)!;
  const delay = minutesBetween(connection.outbound.actualDeparture, flight.actualDeparture);
  return scoreOption(connection.passenger.tier, seating.seatMatch, delay);
}

function betterScore(connection: Connection, left: Flight, right: Flight): boolean {
  const leftScore = scoreOf(connection, left);
  const rightScore = scoreOf(connection, right);
  if (leftScore !== rightScore) return leftScore > rightScore;
  return left.flightNumber.localeCompare(right.flightNumber) < 0;
}

function pick(flights: Flight[], prefer: (left: Flight, right: Flight) => boolean): Flight | undefined {
  let best: Flight | undefined;
  for (const flight of flights) {
    if (!best || prefer(flight, best)) best = flight;
  }
  return best;
}

function makePool(size: number, seed: number): Flight[] {
  let n = seed;
  const next = () => {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    return n / 4294967296;
  };
  const pool: Flight[] = [];
  for (let i = 0; i < size; i++) {
    const airline = next() < 0.5 ? "CX" : "BA";
    const dest = next() < 0.15 ? "SYD" : "LHR";
    const offset = 50 + Math.floor(next() * 400);
    pool.push(
      makeFlight(`${airline}${100 + i}`, airline, "HKG", dest, addMinutesIso(ARR, offset), addMinutesIso(ARR, offset + 780)),
    );
  }
  return pool;
}

describe("generateOptions rank oracle", () => {
  it("linear pick matches sort-by-score then flight number", { timeout: 60_000 }, () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 20, max: 120 }),
        fc.integer({ min: 3, max: 12 }),
        fc.constantFrom(...TIERS),
        fc.nat(),
        (slack, poolSize, tier, seed) => {
          const outbound = makeFlight("CX250", "CX", "HKG", "LHR", addMinutesIso(ARR, slack), addMinutesIso(ARR, slack + 780));
          const connection = makeConnection(INBOUND, outbound, makePassenger("OR", tier, "Economy"));
          if (!isAtRisk(connection)) return;
          const pool = makePool(poolSize, seed);
          const viable = pool.filter((flight) => isViablePublic(connection, flight));
          const originalDay = hkgCalendarDay(outbound.actualDeparture);
          const originalDep = Date.parse(outbound.actualDeparture);
          const sameDay = pick(
            viable.filter((flight) => hkgCalendarDay(flight.actualDeparture) === originalDay),
            (left, right) => betterScore(connection, left, right),
          );
          const chosen = new Set(sameDay ? [sameDay.flightNumber] : []);
          const nextCx = pick(
            viable.filter(
              (flight) =>
                flight.airline === "CX" &&
                Date.parse(flight.actualDeparture) > originalDep &&
                !chosen.has(flight.flightNumber),
            ),
            (left, right) => {
              const delta = Date.parse(left.actualDeparture) - Date.parse(right.actualDeparture);
              if (delta !== 0) return delta < 0;
              return left.flightNumber.localeCompare(right.flightNumber) < 0;
            },
          );
          if (nextCx) chosen.add(nextCx.flightNumber);
          const partner = pick(
            viable.filter(
              (flight) => isOneworldAirline(flight.airline) && flight.airline !== "CX" && !chosen.has(flight.flightNumber),
            ),
            (left, right) => betterScore(connection, left, right),
          );
          const expected = [sameDay, nextCx, partner]
            .filter((flight): flight is Flight => flight !== undefined)
            .sort((left, right) => {
              const delta = scoreOf(connection, right) - scoreOf(connection, left);
              return delta !== 0 ? delta : left.flightNumber.localeCompare(right.flightNumber);
            })
            .slice(0, 3)
            .map((flight) => flight.flightNumber);
          expect(generateOptions(connection, pool).map((option) => option.flight.flightNumber)).toEqual(expected);
        },
      ),
      { numRuns: 2_000 },
    );
  });
});
