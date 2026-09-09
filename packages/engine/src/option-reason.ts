import { formatHkgIso } from "./iso";
import { GATE_WALK_BUFFER_MINUTES, UM_ESCORT_BUFFER_MINUTES, WHEELCHAIR_TRANSIT_BUFFER_MINUTES, hkgMctMinutes } from "./mct";
import { isUnaccompaniedMinor, needsWheelchair, partySizeOf } from "./passenger";
import type { PartySeating } from "./seating";
import type { Flight, Passenger } from "./types";

function clock(iso: string): string {
  return formatHkgIso(Date.parse(iso)).slice(11, 16);
}

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
    return `${booked} is full (${flight.seats[booked]} seats for a party of ${size}). Hold ${seating.offeredCabin} instead (${remaining} seats) so nobody is split off ${flight.flightNumber}.${partyTag}`;
  }
  if (size > 1) {
    return `Party of ${size} stays together: ${remaining} ${seating.offeredCabin} seats left on ${flight.flightNumber}.${partyTag}`;
  }
  if (partyTag) {
    return `${passenger.cabin} still has seats on ${flight.flightNumber}.${partyTag}`;
  }
  return `${passenger.cabin} still has seats on ${flight.flightNumber}.`;
}

export function mctReason(
  inboundAirline: string,
  outboundAirline: string,
  required: number,
  available: number,
): string {
  const mct = hkgMctMinutes(inboundAirline, outboundAirline);
  return `This option has ${available} minutes on the ground. HKG minimum for this pair is ${required} minutes (MCT ${mct} plus a ${GATE_WALK_BUFFER_MINUTES}-minute walk, including any wheelchair or escort time).`;
}

export function delayReason(flight: Flight, delayMinutes: number, originalNumber: string): string {
  const when = clock(flight.actualDeparture);
  const dest = flight.destination;
  if (delayMinutes < 0) {
    return `Protect on ${flight.flightNumber} to ${dest} at ${when}, ${-delayMinutes} minutes earlier than ${originalNumber}.`;
  }
  if (delayMinutes === 0) {
    return `Protect on ${flight.flightNumber} to ${dest} at ${when}, same departure time as ${originalNumber}.`;
  }
  return `Protect on ${flight.flightNumber} to ${dest} at ${when}. That is ${delayMinutes} minutes later than ${originalNumber}.`;
}

export function specialHandlingReasons(passenger: Passenger): string[] {
  const lines: string[] = [];
  if (isUnaccompaniedMinor(passenger)) {
    lines.push(
      `Unaccompanied minor: CX escort adds ${UM_ESCORT_BUFFER_MINUTES} minutes. Keep them on CX metal today — do not overnight them in HKG.`,
    );
  }
  if (needsWheelchair(passenger)) {
    lines.push(
      `Wheelchair assistance: add ${WHEELCHAIR_TRANSIT_BUFFER_MINUTES} minutes of gate transit on top of the MCT table.`,
    );
  }
  return lines;
}
