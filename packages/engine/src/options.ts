import { extraTransitMinutes, isOneworldAirline, requiredMinutes, requiredMinutesFor } from "./mct";
import { minutesBetween } from "./iso";
import { isAtRisk } from "./feasibility";
import { delayReason, mctReason, scoreReason, seatingReason, specialHandlingReasons } from "./option-reason";
import { isUnaccompaniedMinor, partySizeOf } from "./passenger";
import { scoreOption } from "./score";
import { CABIN_RANK, partySeating } from "./seating";
import type { CabinClass, Connection, Flight, RecoveryOption } from "./types";

const HKT_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 86_400_000;

function delayMinutesOf(original: Flight, alternative: Flight): number {
  return minutesBetween(original.actualDeparture, alternative.actualDeparture);
}

function toOption(connection: Connection, flight: Flight): RecoveryOption {
  const passenger = connection.passenger;
  const seating = partySeating(flight, passenger)!;
  const delayMinutes = delayMinutesOf(connection.outbound, flight);
  const score = scoreOption(passenger.tier, seating.seatMatch, delayMinutes);
  const required = requiredMinutesFor(connection.inbound.airline, flight.airline, passenger);
  const available = minutesBetween(connection.inbound.actualArrival, flight.actualDeparture);
  return {
    flight,
    score,
    delayMinutes,
    seatMatch: seating.seatMatch,
    offeredCabin: seating.offeredCabin,
    downgradeProtected: seating.downgradeProtected,
    reasoning: [
      delayReason(flight, delayMinutes, connection.outbound.flightNumber, connection.outbound.actualDeparture),
      mctReason(connection.inbound.airline, flight.airline, required, available),
      seatingReason(flight, passenger, seating),
      ...specialHandlingReasons(passenger),
      scoreReason(passenger.tier, seating.seatMatch, delayMinutes, score),
    ],
  };
}

/** Same HKT calendar day as `hkgCalendarDay`, without building an ISO string. */
function hkgDayKey(epochMs: number): number {
  return Math.floor((epochMs + HKT_OFFSET_MS) / DAY_MS);
}

/** True iff `partySeating` would return a cabin. No object on losers. */
function canSeat(flight: Flight, cabin: CabinClass, size: number): boolean {
  if (flight.seats[cabin] >= size) return true;
  const start = CABIN_RANK.indexOf(cabin);
  for (let i = start + 1; i < CABIN_RANK.length; i++) {
    if (flight.seats[CABIN_RANK[i]!] >= size) return true;
  }
  return false;
}

type Rated = { flight: Flight; score: number; depMs: number };

function beatsScore(next: Rated, best: Rated | undefined): boolean {
  if (!best) return true;
  if (next.score !== best.score) return next.score > best.score;
  return next.flight.flightNumber.localeCompare(best.flight.flightNumber) < 0;
}

function beatsTime(next: Rated, best: Rated | undefined): boolean {
  if (!best) return true;
  if (next.depMs !== best.depMs) return next.depMs < best.depMs;
  return next.flight.flightNumber.localeCompare(best.flight.flightNumber) < 0;
}

/**
 * Up to three viable alternatives from the pool: same-day, next CX, oneworld partner.
 */
export function generateOptions(connection: Connection, pool: readonly Flight[]): RecoveryOption[] {
  if (!isAtRisk(connection)) return [];

  const passenger = connection.passenger;
  const outbound = connection.outbound;
  const outboundNumber = outbound.flightNumber;
  const destination = outbound.destination;
  const um = isUnaccompaniedMinor(passenger);
  const size = partySizeOf(passenger);
  const cabin = passenger.cabin;
  const inboundMs = Date.parse(connection.inbound.actualArrival);
  const outboundMs = Date.parse(outbound.actualDeparture);
  const originalDay = hkgDayKey(outboundMs);
  const extra = extraTransitMinutes(passenger);
  const inboundAirline = connection.inbound.airline;

  const viable: Rated[] = [];
  for (const flight of pool) {
    if (flight.flightNumber === outboundNumber) continue;
    if (flight.origin !== "HKG") continue;
    if (flight.destination !== destination) continue;
    if (um && flight.airline !== "CX") continue;
    if (!canSeat(flight, cabin, size)) continue;
    const depMs = Date.parse(flight.actualDeparture);
    if (um && hkgDayKey(depMs) !== originalDay) continue;
    const available = (depMs - inboundMs) / 60_000;
    if (!(available >= requiredMinutes(inboundAirline, flight.airline) + extra)) continue;
    const delayMinutes = (depMs - outboundMs) / 60_000;
    viable.push({
      flight,
      depMs,
      score: scoreOption(passenger.tier, flight.seats[cabin] >= size, delayMinutes),
    });
  }

  let sameDay: Rated | undefined;
  for (const rated of viable) {
    if (hkgDayKey(rated.depMs) !== originalDay) continue;
    if (beatsScore(rated, sameDay)) sameDay = rated;
  }
  const chosen = new Set(sameDay ? [sameDay.flight.flightNumber] : []);
  let nextCx: Rated | undefined;
  for (const rated of viable) {
    if (rated.flight.airline !== "CX") continue;
    if (!(rated.depMs > outboundMs)) continue;
    if (chosen.has(rated.flight.flightNumber)) continue;
    if (beatsTime(rated, nextCx)) nextCx = rated;
  }
  if (nextCx) chosen.add(nextCx.flight.flightNumber);
  let partner: Rated | undefined;
  for (const rated of viable) {
    if (!isOneworldAirline(rated.flight.airline) || rated.flight.airline === "CX") continue;
    if (chosen.has(rated.flight.flightNumber)) continue;
    if (beatsScore(rated, partner)) partner = rated;
  }

  const options: RecoveryOption[] = [];
  if (sameDay) options.push(toOption(connection, sameDay.flight));
  if (nextCx) options.push(toOption(connection, nextCx.flight));
  if (partner) options.push(toOption(connection, partner.flight));
  options.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.flight.flightNumber.localeCompare(right.flight.flightNumber);
  });
  return options.slice(0, 3);
}
