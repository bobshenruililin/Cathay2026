import { GATE_WALK_BUFFER_MINUTES, UM_ESCORT_BUFFER_MINUTES, WHEELCHAIR_TRANSIT_BUFFER_MINUTES, hkgMctMinutes } from "./mct";
import { hkgCalendarDay } from "./iso";
import { isUnaccompaniedMinor, needsWheelchair, partySizeOf } from "./passenger";
import { TIER_STATUS } from "./score";
import type { PartySeating } from "./seating";
import type { Flight, Passenger } from "./types";

export function seatingReason(
  flight: Flight,
  passenger: Passenger,
  seating: PartySeating,
): string {
  const size = partySizeOf(passenger);
  const booked = passenger.cabin;
  const remaining = flight.seats[seating.offeredCabin];
  const partyTag = passenger.partyId
    ? ` Keep party ${passenger.partyId} together on ${flight.flightNumber}.`
    : "";
  if (seating.downgradeProtected) {
    return `Protect: Hold ${seating.offeredCabin} instead. ${booked} cabin is exhausted (${flight.seats[booked]} seats for a party of ${size}). Downgrade protection holds ${seating.offeredCabin} (${remaining} seats) so the whole party stays on ${flight.flightNumber}.${partyTag}`;
  }
  if (size > 1) {
    return `Hold: Unsplittable party of ${size}: ${remaining} ${seating.offeredCabin} seats remain on ${flight.flightNumber}; the group is kept on one flight.${partyTag}`;
  }
  return `${passenger.cabin} still has seats remaining on ${flight.flightNumber}.${partyTag}`;
}

export function scoreReason(
  tier: Passenger["tier"],
  matched: boolean,
  delayMinutes: number,
  score: number,
): string {
  return `Score ${score} = (tier ${TIER_STATUS[tier]} × 3) + (seat match ${matched ? 1 : 0} × 2) − (${delayMinutes} / 10).`;
}

export function mctReason(
  inboundAirline: string,
  outboundAirline: string,
  required: number,
  available: number,
): string {
  const mct = hkgMctMinutes(inboundAirline, outboundAirline);
  return `HKG MCT ${mct} min plus ${GATE_WALK_BUFFER_MINUTES} min gate walk buffer (${required} min required including passenger buffers); this option has ${available} min.`;
}

export function delayReason(
  flight: Flight,
  delayMinutes: number,
  originalNumber: string,
  originalDeparture: string,
): string {
  const wait = `Wait: Protect on ${flight.flightNumber} to ${flight.destination} at ${flight.actualDeparture}, ${delayMinutes} min from original ${originalNumber}.`;
  if (hkgCalendarDay(flight.actualDeparture) !== hkgCalendarDay(originalDeparture)) {
    return `${wait} Overnight option (next calendar day).`;
  }
  return wait;
}

export function specialHandlingReasons(passenger: Passenger): string[] {
  const lines: string[] = [];
  if (isUnaccompaniedMinor(passenger)) {
    lines.push(
      `Escort: Unaccompanied minor: CX staff escort adds ${UM_ESCORT_BUFFER_MINUTES} min on top of the HKG MCT table. Recovery stays on CX metal; do not overnight them in HKG.`,
    );
  }
  if (needsWheelchair(passenger)) {
    lines.push(
      `Wheelchair assistance adds ${WHEELCHAIR_TRANSIT_BUFFER_MINUTES} min gate transit on top of the HKG MCT table.`,
    );
  }
  return lines;
}
