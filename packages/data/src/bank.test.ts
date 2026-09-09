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
