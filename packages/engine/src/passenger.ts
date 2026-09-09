import type { Passenger } from "./types";

const WHEELCHAIR_SSR = new Set(["WCHR", "WCHS", "WCHC"]);

export function partySizeOf(passenger: Passenger): number {
  const size = passenger.partySize;
  return size !== undefined && size > 0 ? size : 1;
}

export function isUnaccompaniedMinor(passenger: Pick<Passenger, "um" | "ssr">): boolean {
  if (passenger.um === true) return true;
  return (passenger.ssr ?? []).some((code) => code.toUpperCase() === "UMNR");
}

export function needsWheelchair(passenger: Pick<Passenger, "wheelchair" | "ssr">): boolean {
  if (passenger.wheelchair === true) return true;
  return (passenger.ssr ?? []).some((code) => WHEELCHAIR_SSR.has(code.toUpperCase()));
}
