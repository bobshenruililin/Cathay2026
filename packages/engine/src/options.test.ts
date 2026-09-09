import { describe, expect, it } from "vitest";
import { addMinutesIso } from "./iso";
import { generateOptions } from "./options";
import { scoreOption, seatMatch, TIER_STATUS } from "./score";
import { INBOUND, makeConnection, makeFlight, makePassenger } from "./fixtures";
import type { Flight } from "./types";

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
    expect(options[0]?.reasoning.join(" ")).toMatch(/Hold Business instead/);
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
    expect(options.some((o) => o.reasoning.join(" ").includes("still has seats"))).toBe(true);
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

  it("drops overnight CX recovery for an unaccompanied minor", () => {
    const um = makePassenger("UM1", "Gold", "Business", { um: true });
    const ssrUm = makePassenger("UM2", "Gold", "Business", { ssr: ["UMNR"] });
    const adult = makePassenger("AD1");
    const nextDay = cx("CX800", 20 * 60);
    const sameDay = cx("CX260", 100);
    expect(generateOptions(makeConnection(INBOUND, ORIG, um), [nextDay])).toEqual([]);
    expect(generateOptions(makeConnection(INBOUND, ORIG, ssrUm), [nextDay])).toEqual([]);
    expect(generateOptions(makeConnection(INBOUND, ORIG, um), [sameDay])[0]?.flight.flightNumber).toBe("CX260");
    expect(generateOptions(makeConnection(INBOUND, ORIG, adult), [nextDay])[0]?.flight.flightNumber).toBe(
      "CX800",
    );
  });

  it("echoes partyId so the desk can keep a group together", () => {
    const passenger = makePassenger("P4", "Gold", "Business", { partySize: 4, partyId: "CHEN-FAM" });
    const connection = makeConnection(INBOUND, ORIG, passenger);
    const options = generateOptions(connection, [cx("CX260", 100)]);
    expect(options[0]?.reasoning.join(" ")).toMatch(/Keep party CHEN-FAM together on CX260/);
    const solo = makePassenger("P5", "Gold", "Business", { partyId: "SOLO-1" });
    const soloOptions = generateOptions(makeConnection(INBOUND, ORIG, solo), [cx("CX261", 100)]);
    expect(soloOptions[0]?.reasoning.join(" ")).toMatch(/Keep party SOLO-1 together on CX261/);
  });

  it("uses a next-day CX when no same-day alternative exists", () => {
    const connection = makeConnection(INBOUND, ORIG);
    const nextDay = cx("CX800", 20 * 60);
    const options = generateOptions(connection, [nextDay]);
    expect(options).toHaveLength(1);
    expect(options[0]?.flight.flightNumber).toBe("CX800");
    expect(options[0]?.reasoning.join(" ")).toMatch(/Protect on CX800/);
  });

  it("describes earlier and same-time protections in plain language", () => {
    const connection = makeConnection(INBOUND, ORIG);
    const earlier = cx("CX248", 65);
    const sameTime = makeFlight("CX249", "CX", "HKG", "LHR", ORIG.actualDeparture, ORIG.actualArrival);
    expect(generateOptions(connection, [earlier])[0]?.reasoning.join(" ")).toMatch(
      /minutes earlier than CX250/,
    );
    expect(generateOptions(connection, [sameTime])[0]?.reasoning.join(" ")).toMatch(
      /same departure time as CX250/,
    );
    const later = generateOptions(connection, [cx("CX260", 100)])[0]?.reasoning.join(" ") ?? "";
    expect(later).toMatch(/Protect on CX260/);
    expect(later).not.toMatch(/Score /);
  });
});
