import { afterEach, describe, expect, it, vi } from "vitest";
import type { Flight, Passenger, RecoveryOption } from "engine";
import { fetchDraft } from "./client";

const inbound: Flight = {
  flightNumber: "CX254",
  airline: "CX",
  origin: "TPE",
  destination: "HKG",
  scheduledDeparture: "2026-11-16T16:00:00+08:00",
  scheduledArrival: "2026-11-16T18:00:00+08:00",
  actualDeparture: "2026-11-16T16:00:00+08:00",
  actualArrival: "2026-11-16T18:00:00+08:00",
  delayMinutes: 0,
  status: "scheduled",
  gate: "64",
  seats: { First: 0, Business: 20, "Premium Economy": 24, Economy: 140 },
};

const outbound: Flight = {
  ...inbound,
  flightNumber: "CX250",
  origin: "HKG",
  destination: "LHR",
  scheduledDeparture: "2026-11-16T19:30:00+08:00",
  scheduledArrival: "2026-11-17T08:00:00+08:00",
  actualDeparture: "2026-11-16T19:30:00+08:00",
  actualArrival: "2026-11-17T08:00:00+08:00",
  gate: "15",
};

const option: RecoveryOption = {
  flight: { ...outbound, flightNumber: "CX252", scheduledDeparture: "2026-11-16T21:30:00+08:00", actualDeparture: "2026-11-16T21:30:00+08:00" },
  score: 12,
  delayMinutes: 120,
  seatMatch: true,
  offeredCabin: "Business",
  downgradeProtected: false,
  reasoning: ["CX252 replaces original CX250."],
};

const passenger: Passenger = { pnr: "W4N9KD", name: "Mei Chan", tier: "Diamond", cabin: "Business" };
const input = { passenger, inbound, outbound, option, locale: "en" as const };

describe("fetchDraft venue fallback", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the API body when the draft route is up", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ text: "API draft CX252", usedFallback: false }), { status: 200 })),
    );
    const result = await fetchDraft(input);
    expect(result.text).toBe("API draft CX252");
    expect(result.usedFallback).toBe(false);
  });

  it("marks usedFallback when the draft route is down", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("network");
    }));
    const result = await fetchDraft(input);
    expect(result.text.length).toBeGreaterThan(10);
    expect(result.usedFallback).toBe(true);
  });
});
