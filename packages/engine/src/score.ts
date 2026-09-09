import type { CabinClass, Flight, LoyaltyTier } from "./types";

export const TIER_STATUS: Record<LoyaltyTier, number> = {
  Diamond: 4,
  Gold: 3,
  Silver: 2,
  Green: 1,
};

export function seatMatch(flight: Flight, cabin: CabinClass): boolean {
  return flight.seats[cabin] > 0;
}

export function scoreOption(
  tier: LoyaltyTier,
  hasSeatMatch: boolean,
  delayMinutes: number,
): number {
  return TIER_STATUS[tier] * 3 + (hasSeatMatch ? 1 : 0) * 2 - delayMinutes / 10;
}
