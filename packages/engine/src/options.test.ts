import { describe, expect, it } from "vitest";
import { addMinutesIso } from "./iso";
import { generateOptions } from "./options";
import { scoreOption, seatMatch, TIER_STATUS } from "./score";
import { INBOUND, makeConnection, makeFlight, makePassenger } from "./fixtures";
import type { Flight, LoyaltyTier } from "./types";

const ARR = INBOUND.actualArrival;
const ORIG = makeFlight("CX250", "CX", "HKG", "LHR", addMinutesIso(ARR, 70), addMinutesIso(ARR, 850));

function cx(num: string, depOffset: number, seats?: Flight["seats"]): Flight {
  return makeFlight(num, "CX", "HKG", "LHR", addMinutesIso(ARR, depOffset), addMinutesIso(ARR, depOffset + 780), seats);
}

function ba(num: string, depOffset: number, seats?: Flight["seats"]): Flight {
  return makeFlight(num, "BA", "HKG", "LHR", addMinutesIso(ARR, depOffset), addMinutesIso(ARR, depOffset + 780), seats);
}

describe("ranking", () => {
  it("uses (tier * 3) + (seat match * 2) - (delay / 10)", () => {
    expect(TIER_STATUS.Diamond).toBe(4);
    expect(scoreOption("Diamond", true, 40)).toBe(4 * 3 + 2 - 4);
    expect(scoreOption("Green", false, 0)).toBe(3);
    expect(seatMatch(ORIG, "Business")).toBe(true);
    const none = { ...ORIG, seats: { First: 0, Business: 0, "Premium Economy": 0, Economy: 0 } };
    expect(seatMatch(none, "Business")).toBe(false);
  });
});

describe("option generator", () => {
  it("returns up to one same-day, one next CX, and one oneworld partner", () => {
    const connection = makeConnection(INBOUND, ORIG, makePassenger("P1", "Diamond", "Business"));
    const sameDayBetter = cx("CX252", 90);
    const laterCx = cx("CX254", 200);
    const partner = ba("BA32", 120);
    const noise = makeFlight("CX9", "CX", "HKG", "SYD", addMinutesIso(ARR, 90), addMinutesIso(ARR, 600));
    const tooTight = cx("CX248", 20);
    const original = ORIG;
    const options = generateOptions(connection, [original, sameDayBetter, laterCx, partner, noise, tooTight]);
    expect(options.length).toBe(3);
    const numbers = options.map((o) => o.flight.flightNumber).sort();
    expect(numbers).toContain("CX252");
    expect(numbers).toContain("CX254");
    expect(numbers).toContain("BA32");
    for (const option of options) {
      expect(option.reasoning.length).toBeGreaterThan(0);
      expect(option.score).toBe(
        scoreOption(connection.passenger.tier, option.seatMatch, option.delayMinutes),
      );
    }
  });

  it("omits empty categories and skips duplicates when next CX is also same-day best", () => {
    const connection = makeConnection(INBOUND, ORIG);
    const only = cx("CX260", 100);
    const options = generateOptions(connection, [only]);
    expect(options.length).toBe(1);
    expect(options[0]?.flight.flightNumber).toBe("CX260");
  });

  it("tie-breaks equal scores by flight number and reports missing seats", () => {
    const passenger = makePassenger("P2", "Silver", "First");
    const connection = makeConnection(INBOUND, ORIG, passenger);
    const noFirst = {
      First: 0,
      Business: 10,
      "Premium Economy": 10,
      Economy: 10,
    };
    const a = ba("BA40", 100, noFirst);
    const b = ba("BA30", 100, noFirst);
    const options = generateOptions(connection, [a, b]);
    expect(options[0]?.flight.flightNumber).toBe("BA30");
    expect(options[0]?.seatMatch).toBe(false);
    expect(options[0]?.downgradeProtected).toBe(true);
    expect(options[0]?.offeredCabin).toBe("Business");
    expect(options[0]?.reasoning.join(" ")).toMatch(/Downgrade protection/);
  });

  it("picks the next CX after the original even when a later CX scores lower", () => {
    const connection = makeConnection(INBOUND, ORIG, makePassenger("P3", "Green", "Economy"));
    const earlierThanOriginal = cx("CX240", 65);
    const nextA = cx("CX270", 180);
    const nextB = cx("CX269", 180);
    const muchLater = cx("CX290", 400);
    const options = generateOptions(connection, [muchLater, earlierThanOriginal, nextA, nextB]);
    const numbers = options.map((o) => o.flight.flightNumber);
    expect(numbers).toContain("CX269");
    expect(options.some((o) => o.reasoning.join(" ").includes("seats remain"))).toBe(true);
  });

  it("returns no options when the pool is empty or all unviable", () => {
    const connection = makeConnection(INBOUND, ORIG);
    expect(generateOptions(connection, [])).toEqual([]);
    const wrongOrigin = makeFlight("BA1", "BA", "TPE", "LHR", addMinutesIso(ARR, 120), addMinutesIso(ARR, 900));
    expect(generateOptions(connection, [wrongOrigin, ORIG])).toEqual([]);
  });

  it("returns no options for healthy or invalid itineraries", () => {
    const healthyOut = makeFlight(
      "CX250",
      "CX",
      "HKG",
      "LHR",
      addMinutesIso(ARR, 180),
      addMinutesIso(ARR, 960),
    );
    const partner = ba("BA32", 200);
    expect(generateOptions(makeConnection(INBOUND, healthyOut), [partner])).toEqual([]);
    const invalidOut = makeFlight("CX250", "CX", "TPE", "LHR", ARR, ARR);
    expect(generateOptions(makeConnection(INBOUND, invalidOut), [partner])).toEqual([]);
  });

  it("uses a next-day CX when no same-day alternative exists", () => {
    const connection = makeConnection(INBOUND, ORIG);
    const nextDay = cx("CX800", 20 * 60);
    const options = generateOptions(connection, [nextDay]);
    expect(options).toHaveLength(1);
    expect(options[0]?.flight.flightNumber).toBe("CX800");
    expect(options[0]?.reasoning.join(" ")).toMatch(/Score /);
  });

  it("property: option generation stays ≤3, unique, scored, and reasoned", () => {
    let t = 0x9e3779b9;
    const next = () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const tiers: LoyaltyTier[] = ["Diamond", "Gold", "Silver", "Green"];
    for (let i = 0; i < 40; i++) {
      const passenger = makePassenger(`P${i}`, tiers[Math.floor(next() * 4)]!, "Economy", {
        um: next() < 0.2,
        wheelchair: next() < 0.2,
        partySize: next() < 0.2 ? 4 : 1,
      });
      const outbound = cx("CX250", 40);
      const connection = makeConnection(INBOUND, outbound, passenger);
      const pool: Flight[] = [];
      const size = 2 + Math.floor(next() * 8);
      for (let j = 0; j < size; j++) {
        const airline = next() < 0.5 ? "CX" : "BA";
        const offset = 70 + Math.floor(next() * 300);
        pool.push(
          makeFlight(
            `${airline}${100 + j}`,
            airline,
            "HKG",
            next() < 0.1 ? "SYD" : "LHR",
            addMinutesIso(ARR, offset),
            addMinutesIso(ARR, offset + 780),
          ),
        );
      }
      const options = generateOptions(connection, pool);
      expect(options.length).toBeLessThanOrEqual(3);
      const seen = new Set<string>();
      for (const option of options) {
        expect(seen.has(option.flight.flightNumber)).toBe(false);
        seen.add(option.flight.flightNumber);
        expect(option.reasoning.length).toBeGreaterThan(0);
        expect(option.score).toBe(scoreOption(passenger.tier, option.seatMatch, option.delayMinutes));
        expect(option.offeredCabin).toBeTruthy();
        if (passenger.um) expect(option.flight.airline).toBe("CX");
      }
    }
  });
});
