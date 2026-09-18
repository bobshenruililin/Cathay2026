import { addMinutesIso } from "../src/iso";
import { makeFlight, makePassenger } from "../src/fixtures";
import type { CabinSeats, Flight, Passenger } from "../src/types";

export const ARR = "2026-11-16T18:00:00+08:00";

const FULL: CabinSeats = { First: 4, Business: 20, "Premium Economy": 24, Economy: 140 };
const BIZ: CabinSeats = { First: 0, Business: 8, "Premium Economy": 10, Economy: 40 };
const ECO4: CabinSeats = { First: 0, Business: 0, "Premium Economy": 0, Economy: 4 };
const EMPTY: CabinSeats = { First: 0, Business: 0, "Premium Economy": 0, Economy: 0 };

export type Recipe = {
  id: string;
  inboundAirline: string;
  inboundNum: string;
  inboundOrigin: string;
  outboundAirline: string;
  outboundNum: string;
  slack: number;
  dest?: string;
  pax: () => Passenger;
};

export const RECIPES: Recipe[] = [
  { id: "adult-first", inboundAirline: "CX", inboundNum: "CX401", inboundOrigin: "TPE", outboundAirline: "CX", outboundNum: "CX250", slack: 40, pax: () => makePassenger("ADLT", "Diamond", "First") },
  { id: "um-flag", inboundAirline: "CX", inboundNum: "CX401", inboundOrigin: "TPE", outboundAirline: "CX", outboundNum: "CX250", slack: 40, pax: () => makePassenger("UMFG", "Green", "Economy", { um: true }) },
  { id: "umnr-ssr", inboundAirline: "CX", inboundNum: "CX401", inboundOrigin: "TPE", outboundAirline: "CX", outboundNum: "CX250", slack: 50, pax: () => makePassenger("UMNR", "Gold", "Economy", { ssr: ["UMNR"] }) },
  { id: "wch-flag", inboundAirline: "CX", inboundNum: "CX401", inboundOrigin: "TPE", outboundAirline: "CX", outboundNum: "CX250", slack: 40, pax: () => makePassenger("WCFG", "Gold", "Business", { wheelchair: true }) },
  { id: "wchr-ssr", inboundAirline: "BA", inboundNum: "BA32", inboundOrigin: "LHR", outboundAirline: "CX", outboundNum: "CX250", slack: 55, pax: () => makePassenger("WCHR", "Silver", "Premium Economy", { ssr: ["WCHR"] }) },
  { id: "wchs-ssr", inboundAirline: "UO", inboundNum: "UO626", inboundOrigin: "NRT", outboundAirline: "CX", outboundNum: "CX250", slack: 45, pax: () => makePassenger("WCHS", "Gold", "Business", { ssr: ["WCHS"] }) },
  { id: "wchc-ssr", inboundAirline: "QF", inboundNum: "QF29", inboundOrigin: "SYD", outboundAirline: "CX", outboundNum: "CX250", slack: 40, pax: () => makePassenger("WCHC", "Green", "Economy", { ssr: ["WCHC"] }) },
  { id: "party4", inboundAirline: "CX", inboundNum: "CX401", inboundOrigin: "TPE", outboundAirline: "CX", outboundNum: "CX250", slack: 40, pax: () => makePassenger("P4", "Gold", "Business", { partySize: 4, partyId: "COLE" }) },
  { id: "um-wch-party", inboundAirline: "CX", inboundNum: "CX401", inboundOrigin: "TPE", outboundAirline: "CX", outboundNum: "CX250", slack: 35, pax: () => makePassenger("MIX", "Gold", "Economy", { um: true, wheelchair: true, partySize: 4, partyId: "COLE" }) },
  { id: "uo-in", inboundAirline: "UO", inboundNum: "UO616", inboundOrigin: "ICN", outboundAirline: "CX", outboundNum: "CX250", slack: 40, pax: () => makePassenger("UOIN", "Silver", "Economy") },
  { id: "other-5j", inboundAirline: "5J", inboundNum: "5J108", inboundOrigin: "MNL", outboundAirline: "BA", outboundNum: "BA16", slack: 30, pax: () => makePassenger("OTHR", "Green", "Economy") },
  { id: "healthy", inboundAirline: "CX", inboundNum: "CX401", inboundOrigin: "TPE", outboundAirline: "CX", outboundNum: "CX250", slack: 200, pax: () => makePassenger("OK", "Gold", "Business") },
  { id: "overnight", inboundAirline: "CX", inboundNum: "CX401", inboundOrigin: "TPE", outboundAirline: "CX", outboundNum: "CX390", slack: 40, dest: "NRT", pax: () => makePassenger("NITE", "Gold", "Economy") },
  { id: "invalid", inboundAirline: "CX", inboundNum: "CX401", inboundOrigin: "TPE", outboundAirline: "CX", outboundNum: "CX250", slack: 40, pax: () => makePassenger("BAD", "Gold", "Business") },
];

export function coverageFlights(): Flight[] {
  const f = (num: string, al: string, dest: string, off: number, seats: CabinSeats, gate: string, delay = 0, status: Flight["status"] = "scheduled"): Flight => {
    const dep = addMinutesIso(ARR, off);
    const arr = addMinutesIso(ARR, off + 780);
    return {
      ...makeFlight(num, al, "HKG", dest, dep, arr, seats),
      gate,
      delayMinutes: delay,
      status,
      scheduledDeparture: dep,
      scheduledArrival: arr,
    };
  };
  return [
    f("CX250", "CX", "LHR", 40, FULL, "15"),
    f("CX252", "CX", "LHR", 90, FULL, "21", 5, "delayed"),
    f("CX254", "CX", "LHR", 200, FULL, "23"),
    f("CX269", "CX", "LHR", 180, FULL, "24"),
    f("CX270", "CX", "LHR", 180, FULL, "25"),
    f("CX800", "CX", "LHR", 20 * 60, FULL, "31", 0, "scheduled"),
    f("BA30", "BA", "LHR", 100, BIZ, "41"),
    f("BA40", "BA", "LHR", 100, BIZ, "42"),
    f("QF28", "QF", "LHR", 120, FULL, "43"),
    f("JL26", "JL", "LHR", 150, FULL, "44"),
    f("AA18", "AA", "LHR", 160, FULL, "45"),
    f("UO620", "UO", "LHR", 110, FULL, "12"),
    f("5J110", "5J", "LHR", 130, FULL, "61"),
    f("CX9", "CX", "SYD", 90, FULL, "71"),
    f("CX260", "CX", "LHR", 95, BIZ, "22"),
    f("CX261", "CX", "LHR", 140, ECO4, "26"),
    f("CX262", "CX", "LHR", 210, EMPTY, "27"),
    f("CX253", "CX", "NRT", 55, FULL, "81"),
    f("CX801", "CX", "NRT", 20 * 60, FULL, "82"),
    f("BA82", "BA", "NRT", 20 * 60 + 30, FULL, "83"),
    (() => {
      const trap = f("BA1", "BA", "LHR", 120, FULL, "99");
      trap.origin = "TPE";
      return trap;
    })(),
  ];
}
