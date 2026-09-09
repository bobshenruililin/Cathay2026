import { GATE_WALK_BUFFER_MINUTES, hkgMctMinutes, isOneworldAirline, requiredMinutes } from "./mct";
import { hkgCalendarDay, minutesBetween } from "./iso";
import { isAtRisk } from "./feasibility";
import { TIER_STATUS, scoreOption, seatMatch } from "./score";
import type { Connection, Flight, RecoveryOption } from "./types";

function delayMinutesOf(original: Flight, alternative: Flight): number {
  return minutesBetween(original.actualDeparture, alternative.actualDeparture);
}

function toOption(connection: Connection, flight: Flight): RecoveryOption {
  const passenger = connection.passenger;
  const matched = seatMatch(flight, passenger.cabin);
  const delayMinutes = delayMinutesOf(connection.outbound, flight);
  const score = scoreOption(passenger.tier, matched, delayMinutes);
  const mct = hkgMctMinutes(connection.inbound.airline, flight.airline);
  const required = requiredMinutes(connection.inbound.airline, flight.airline);
  const available = minutesBetween(connection.inbound.actualArrival, flight.actualDeparture);
  const seatLine = matched
    ? `${passenger.cabin} seats remain on ${flight.flightNumber}.`
    : `No ${passenger.cabin} seats remain on ${flight.flightNumber}; seat match is 0.`;
  return {
    flight,
    score,
    delayMinutes,
    seatMatch: matched,
    reasoning: [
      `${flight.flightNumber} ${flight.origin}-${flight.destination} departs ${flight.actualDeparture}, ${delayMinutes} min from original ${connection.outbound.flightNumber}.`,
      `HKG MCT ${mct} min plus ${GATE_WALK_BUFFER_MINUTES} min gate walk buffer (${required} min required); this option has ${available} min.`,
      seatLine,
      `Score ${score} = (tier ${TIER_STATUS[passenger.tier]} × 3) + (seat match ${matched ? 1 : 0} × 2) − (${delayMinutes} / 10).`,
    ],
  };
}

function compareCandidates(connection: Connection, left: Flight, right: Flight): number {
  const leftOption = toOption(connection, left);
  const rightOption = toOption(connection, right);
  if (rightOption.score !== leftOption.score) return rightOption.score - leftOption.score;
  return left.flightNumber.localeCompare(right.flightNumber);
}

function pickBest(connection: Connection, flights: readonly Flight[]): Flight | undefined {
  if (flights.length === 0) return undefined;
  return [...flights].sort((left, right) => compareCandidates(connection, left, right))[0];
}

function pickNextCx(flights: readonly Flight[]): Flight | undefined {
  if (flights.length === 0) return undefined;
  return [...flights].sort((left, right) => {
    const byTime = Date.parse(left.actualDeparture) - Date.parse(right.actualDeparture);
    if (byTime !== 0) return byTime;
    return left.flightNumber.localeCompare(right.flightNumber);
  })[0];
}

function isViable(connection: Connection, candidate: Flight): boolean {
  if (candidate.flightNumber === connection.outbound.flightNumber) return false;
  if (candidate.origin !== "HKG") return false;
  if (candidate.destination !== connection.outbound.destination) return false;
  const available = minutesBetween(connection.inbound.actualArrival, candidate.actualDeparture);
  return available >= requiredMinutes(connection.inbound.airline, candidate.airline);
}

/**
 * Up to three viable alternatives from the pool: same-day, next CX, oneworld partner.
 */
export function generateOptions(connection: Connection, pool: readonly Flight[]): RecoveryOption[] {
  if (!isAtRisk(connection)) return [];

  const viable = pool.filter((flight) => isViable(connection, flight));
  const originalDay = hkgCalendarDay(connection.outbound.actualDeparture);
  const originalDep = Date.parse(connection.outbound.actualDeparture);

  const sameDay = pickBest(
    connection,
    viable.filter((flight) => hkgCalendarDay(flight.actualDeparture) === originalDay),
  );
  const chosen = new Set(sameDay ? [sameDay.flightNumber] : []);
  const nextCx = pickNextCx(
    viable.filter(
      (flight) =>
        flight.airline === "CX" &&
        Date.parse(flight.actualDeparture) > originalDep &&
        !chosen.has(flight.flightNumber),
    ),
  );
  if (nextCx) chosen.add(nextCx.flightNumber);
  const partner = pickBest(
    connection,
    viable.filter(
      (flight) =>
        isOneworldAirline(flight.airline) &&
        flight.airline !== "CX" &&
        !chosen.has(flight.flightNumber),
    ),
  );

  const options: RecoveryOption[] = [];
  if (sameDay) options.push(toOption(connection, sameDay));
  if (nextCx) options.push(toOption(connection, nextCx));
  if (partner) options.push(toOption(connection, partner));
  options.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.flight.flightNumber.localeCompare(right.flight.flightNumber);
  });
  return options.slice(0, 3);
}
