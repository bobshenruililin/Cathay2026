import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { addMinutesIso, hkgCalendarDay, minutesBetween } from "../src/iso";
import {
  TIGHT_SLACK_EXTRA_MINUTES,
  connectionRequiredMinutes,
  connectionStatus,
  generateOptions,
  isAtRisk,
  isUnaccompaniedMinor,
  requiredMinutesFor,
  slackMinutes,
} from "../src/index";
import { INBOUND, makeConnection, makeFlight, makePassenger } from "../src/fixtures";
import type { Flight, LoyaltyTier } from "../src/types";

const ARR = INBOUND.actualArrival;
const TIERS: LoyaltyTier[] = ["Diamond", "Gold", "Silver", "Green"];
const RUNS = { numRuns: 10_000 };

describe("fast-check 10k", () => {
  it("isAtRisk matches slack against passenger-adjusted required minutes", { timeout: 60_000 }, () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 400 }),
        fc.boolean(),
        fc.boolean(),
        (slack, wheelchair, um) => {
          const outbound = makeFlight(
            "CX250",
            "CX",
            "HKG",
            "LHR",
            addMinutesIso(ARR, slack),
            addMinutesIso(ARR, slack + 780),
          );
          const connection = makeConnection(
            INBOUND,
            outbound,
            makePassenger("FC", "Gold", "Business", { wheelchair, um }),
          );
          const required = connectionRequiredMinutes(connection);
          const actualSlack = slackMinutes(connection);
          const atRisk = isAtRisk(connection);
          const status = connectionStatus(connection);
          expect(actualSlack).toBe(slack);
          if (actualSlack >= required + TIGHT_SLACK_EXTRA_MINUTES) {
            expect(atRisk).toBe(false);
            expect(status).toBe("ok");
          } else if (actualSlack < required) {
            expect(atRisk).toBe(true);
            expect(status).toBe("missed");
          } else {
            expect(atRisk).toBe(true);
            expect(status).toBe("tight");
          }
        },
      ),
      RUNS,
    );
  });

  it("generateOptions stays ≤3, unique, feasible, and empty when not at-risk", { timeout: 60_000 }, () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 20, max: 220 }),
        fc.integer({ min: 0, max: 8 }),
        fc.constantFrom(...TIERS),
        fc.boolean(),
        fc.boolean(),
        fc.integer({ min: 1, max: 4 }),
        fc.nat(),
        (slack, poolSize, tier, um, wheelchair, partySize, seed) => {
          const outbound = makeFlight(
            "CX250",
            "CX",
            "HKG",
            "LHR",
            addMinutesIso(ARR, slack),
            addMinutesIso(ARR, slack + 780),
          );
          const passenger = makePassenger("FC", tier, "Economy", { um, wheelchair, partySize });
          const connection = makeConnection(INBOUND, outbound, passenger);
          const pool: Flight[] = [];
          let n = seed;
          const next = () => {
            n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
            return n / 4294967296;
          };
          for (let i = 0; i < poolSize; i++) {
            const airline = next() < 0.5 ? "CX" : "BA";
            const dest = next() < 0.15 ? "SYD" : "LHR";
            const offset = 50 + Math.floor(next() * 400);
            pool.push(
              makeFlight(
                `${airline}${100 + i}`,
                airline,
                "HKG",
                dest,
                addMinutesIso(ARR, offset),
                addMinutesIso(ARR, offset + 780),
              ),
            );
          }
          const options = generateOptions(connection, pool);
          if (!isAtRisk(connection)) {
            expect(options).toEqual([]);
            return;
          }
          expect(options.length).toBeLessThanOrEqual(3);
          const seen = new Set<string>();
          const originalDay = hkgCalendarDay(connection.outbound.actualDeparture);
          for (const option of options) {
            expect(seen.has(option.flight.flightNumber)).toBe(false);
            seen.add(option.flight.flightNumber);
            expect(option.flight.origin).toBe("HKG");
            expect(option.flight.destination).toBe("LHR");
            const available = minutesBetween(INBOUND.actualArrival, option.flight.actualDeparture);
            expect(available).toBeGreaterThanOrEqual(
              requiredMinutesFor("CX", option.flight.airline, passenger),
            );
            if (isUnaccompaniedMinor(passenger)) {
              expect(option.flight.airline).toBe("CX");
              expect(hkgCalendarDay(option.flight.actualDeparture) <= originalDay).toBe(true);
            }
          }
        },
      ),
      RUNS,
    );
  });
});
