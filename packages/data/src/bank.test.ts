import { describe, expect, it } from "vitest";
import { generateEveningBank } from "./bank.ts";
import { BANK_END_ISO, BANK_START_ISO } from "./catalog.ts";
import { createPrng, hashSeed, rngInt } from "./prng.ts";

function snapshot(seed: string | number): string {
  return JSON.stringify(generateEveningBank(seed));
}

describe("evening bank", () => {
  it("builds the HKG 18:00-02:00 mix with 300 PNRs", () => {
    const bank = generateEveningBank(42);
    const cx = bank.flights.filter((f) => f.airline === "CX");
    const uo = bank.flights.filter((f) => f.airline === "UO");
    const partners = bank.flights.filter((f) => f.airline !== "CX" && f.airline !== "UO");
    expect(cx).toHaveLength(80);
    expect(uo).toHaveLength(20);
    expect(partners).toHaveLength(20);
    expect(partners.every((f) => f.origin === "HKG")).toBe(true);
    expect(bank.connections).toHaveLength(300);
    const start = Date.parse(BANK_START_ISO);
    const end = Date.parse(BANK_END_ISO);
    for (const flight of bank.flights) {
      const hubTime =
        flight.destination === "HKG"
          ? Date.parse(flight.scheduledArrival)
          : Date.parse(flight.scheduledDeparture);
      expect(hubTime).toBeGreaterThanOrEqual(start);
      expect(hubTime).toBeLessThanOrEqual(end);
    }
    const tiers = new Set(bank.connections.map((c) => c.passenger.tier));
    const cabins = new Set(bank.connections.map((c) => c.passenger.cabin));
    expect(tiers).toEqual(new Set(["Diamond", "Gold", "Silver", "Green"]));
    expect(cabins).toEqual(new Set(["First", "Business", "Premium Economy", "Economy"]));
    expect(bank.connections.some((c) => c.passenger.um === true)).toBe(true);
    expect(bank.connections.some((c) => c.passenger.wheelchair === true)).toBe(true);
    expect(bank.connections.some((c) => c.passenger.partySize === 4)).toBe(true);
  });

  it("includes inbound CX254 as a connection feeder", () => {
    const bank = generateEveningBank("hkg-demo");
    const cx254 = bank.flights.filter((flight) => flight.flightNumber === "CX254");
    expect(cx254).toHaveLength(1);
    expect(cx254[0]?.destination).toBe("HKG");
    expect(bank.connections.some((row) => row.inboundFlightNumber === "CX254")).toBe(true);
  });

  it("pins named desk cases on CX254 feeders", () => {
    const bank = generateEveningBank("hkg-demo");
    const byPnr = Object.fromEntries(bank.connections.map((row) => [row.passenger.pnr, row]));
    const mei = byPnr.W4N9KD;
    expect(mei?.passenger).toMatchObject({ name: "Mei Chan", um: true, cabin: "Business" });
    expect(mei?.inboundFlightNumber).toBe("CX254");
    expect(byPnr.P8T2LM?.passenger.wheelchair).toBe(true);
    expect(byPnr.P8T2LM?.inboundFlightNumber).toBe("CX254");
    expect(byPnr.Q1H6VB?.passenger).toMatchObject({ partySize: 4, partyId: "PATEL" });
    expect(byPnr.Q1H6VB?.inboundFlightNumber).toBe("CX254");
    expect(byPnr.SSRWCH?.passenger.ssr).toEqual(["WCHR"]);
    expect(byPnr.SSRWCH?.passenger.wheelchair).toBeUndefined();
    expect(byPnr.SSRWCH?.inboundFlightNumber).toBe("CX254");
    expect(byPnr.SSRUMNR?.passenger.ssr).toEqual(["UMNR"]);
    expect(byPnr.SSRUMNR?.passenger.um).toBeUndefined();
    expect(byPnr.SSRUMNR?.inboundFlightNumber).toBe("CX254");
    expect(byPnr.MIXED4?.passenger).toMatchObject({
      um: true,
      wheelchair: true,
      partySize: 4,
      partyId: "COLE",
    });
    expect(byPnr.MIXED4?.inboundFlightNumber).toBe("CX254");
    const pnrs = bank.connections.map((row) => row.passenger.pnr);
    expect(new Set(pnrs).size).toBe(300);
  });

  it("is byte-identical for the same seed and differs otherwise", () => {
    expect(snapshot(42)).toBe(snapshot(42));
    expect(snapshot("hkg-bank")).toBe(snapshot("hkg-bank"));
    expect(snapshot(42)).not.toBe(snapshot(43));
    expect(snapshot("hkg-bank")).not.toBe(snapshot("hkg-bank-2"));
  });
});

describe("prng helpers", () => {
  it("hashes numbers and strings and guards rngInt", () => {
    expect(hashSeed(42)).toBe(42 >>> 0);
    expect(hashSeed("a")).not.toBe(hashSeed("b"));
    const rng = createPrng(1);
    expect(rngInt(rng, 0)).toBe(0);
    expect(rngInt(rng, 4)).toBeGreaterThanOrEqual(0);
  });
});
