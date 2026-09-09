import type { Passenger } from "./types";

export function partySizeOf(passenger: Passenger): number {
  const size = passenger.partySize;
  return size !== undefined && size > 0 ? size : 1;
}

export function isUnaccompaniedMinor(passenger: Passenger): boolean {
  return passenger.um === true;
}

export function needsWheelchair(passenger: Passenger): boolean {
  return passenger.wheelchair === true;
}
