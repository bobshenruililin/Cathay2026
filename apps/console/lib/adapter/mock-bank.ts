import { addMinutesIso } from "engine";
import type { CabinSeats, Flight, Passenger } from "engine";

const LONGHAUL: CabinSeats = {
  First: 6,
  Business: 28,
  "Premium Economy": 32,
  Economy: 180,
};

const REGIONAL: CabinSeats = {
  First: 0,
  Business: 18,
  "Premium Economy": 0,
  Economy: 140,
};

export const BANK_CLOCK = "2026-11-16T20:00:00+08:00";

export function flight(
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  dep: string,
  arr: string,
  seats: CabinSeats = origin === "HKG" || destination === "HKG" ? LONGHAUL : REGIONAL,
): Flight {
  return {
    flightNumber,
    airline,
    origin,
    destination,
    scheduledDeparture: dep,
    scheduledArrival: arr,
    actualDeparture: dep,
    actualArrival: arr,
    delayMinutes: 0,
    status: "scheduled",
    gate: origin === "HKG" ? "15" : "64",
    seats,
  };
}

export type Link = {
  passenger: Passenger;
  inboundFlightNumber: string;
  outboundFlightNumber: string;
};

export function seedFlights(): Flight[] {
  const t = BANK_CLOCK;
  return [
    flight("CX401", "CX", "TPE", "HKG", addMinutesIso(t, -140), addMinutesIso(t, -80)),
    flight("CX501", "CX", "NRT", "HKG", addMinutesIso(t, -160), addMinutesIso(t, -70)),
    flight("CX731", "CX", "BKK", "HKG", addMinutesIso(t, -120), addMinutesIso(t, -50)),
    flight("UO102", "UO", "KIX", "HKG", addMinutesIso(t, -130), addMinutesIso(t, -60), REGIONAL),
    flight("CX250", "CX", "HKG", "LHR", addMinutesIso(t, -35), addMinutesIso(t, 745)),
    flight("CX252", "CX", "HKG", "LHR", addMinutesIso(t, 90), addMinutesIso(t, 870)),
    flight("CX254", "CX", "HKG", "LHR", addMinutesIso(t, 180), addMinutesIso(t, 960)),
    flight("BA32", "BA", "HKG", "LHR", addMinutesIso(t, 70), addMinutesIso(t, 850)),
    flight("CX288", "CX", "HKG", "CDG", addMinutesIso(t, -20), addMinutesIso(t, 740)),
    flight("CX290", "CX", "HKG", "CDG", addMinutesIso(t, 110), addMinutesIso(t, 870)),
    flight("AF185", "AF", "HKG", "CDG", addMinutesIso(t, 95), addMinutesIso(t, 860)),
    flight("CX500", "CX", "HKG", "NRT", addMinutesIso(t, 40), addMinutesIso(t, 280)),
    flight("JL26", "JL", "HKG", "NRT", addMinutesIso(t, 80), addMinutesIso(t, 320)),
    flight("CX402", "CX", "HKG", "TPE", addMinutesIso(t, 25), addMinutesIso(t, 120)),
  ];
}

export function seedLinks(): Link[] {
  return [
    { passenger: p("W4N9KD", "Mei Chan", "Diamond", "Business"), inboundFlightNumber: "CX401", outboundFlightNumber: "CX250" },
    { passenger: p("P8T2LM", "James Wong", "Gold", "Premium Economy"), inboundFlightNumber: "CX401", outboundFlightNumber: "CX250" },
    { passenger: p("Q1H6VB", "Aisha Patel", "Silver", "Economy"), inboundFlightNumber: "CX501", outboundFlightNumber: "CX288" },
    { passenger: p("R7K3ZX", "Hiro Tanaka", "Diamond", "First"), inboundFlightNumber: "CX731", outboundFlightNumber: "CX288" },
    { passenger: p("S2M9QC", "Sofia Rossi", "Green", "Economy"), inboundFlightNumber: "UO102", outboundFlightNumber: "CX500" },
    { passenger: p("T5B1YD", "Noah Kim", "Gold", "Business"), inboundFlightNumber: "CX501", outboundFlightNumber: "CX250" },
    { passenger: p("U9C4WE", "Priya Singh", "Silver", "Economy"), inboundFlightNumber: "CX731", outboundFlightNumber: "CX402" },
    { passenger: p("V3D8AF", "Lucas Garcia", "Green", "Economy"), inboundFlightNumber: "UO102", outboundFlightNumber: "CX288" },
  ];
}

function p(
  pnr: string,
  name: string,
  tier: Passenger["tier"],
  cabin: Passenger["cabin"],
): Passenger {
  return { pnr, name, tier, cabin };
}
