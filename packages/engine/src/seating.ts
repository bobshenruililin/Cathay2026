import { partySizeOf } from "./passenger";
import type { CabinClass, Flight, Passenger } from "./types";

export const CABIN_RANK: CabinClass[] = ["First", "Business", "Premium Economy", "Economy"];

export type PartySeating = {
  offeredCabin: CabinClass;
  seatMatch: boolean;
  downgradeProtected: boolean;
};

/**
 * Whole party must sit on one flight in one cabin.
 * Booked cabin first; otherwise the next lower cabin (downgrade protection).
 */
export function partySeating(flight: Flight, passenger: Passenger): PartySeating | undefined {
  const size = partySizeOf(passenger);
  const booked = passenger.cabin;
  if (flight.seats[booked] >= size) {
    return { offeredCabin: booked, seatMatch: true, downgradeProtected: false };
  }
  const start = CABIN_RANK.indexOf(booked);
  for (let i = start + 1; i < CABIN_RANK.length; i++) {
    const cabin = CABIN_RANK[i]!;
    if (flight.seats[cabin] >= size) {
      return { offeredCabin: cabin, seatMatch: false, downgradeProtected: true };
    }
  }
  return undefined;
}
