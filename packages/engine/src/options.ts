import { isOneworldAirline, requiredMinutesFor } from "./mct";
import { hkgCalendarDay, minutesBetween } from "./iso";
import { isAtRisk } from "./feasibility";
import { delayReason, mctReason, scoreReason, seatingReason, specialHandlingReasons } from "./option-reason";
import { isUnaccompaniedMinor, partySizeOf } from "./passenger";
import { scoreOption, seatMatch } from "./score";
import { partySeating } from "./seating";
import type { Connection, Flight, RecoveryOption } from "./types";

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

/** Score only — no reasoning strings. Same formula as `toOption`. */
function optionScore(connection: Connection, flight: Flight): number {
  const matched = seatMatch(flight, connection.passenger.cabin, partySizeOf(connection.passenger));
  return scoreOption(connection.passenger.tier, matched, delayMinutesOf(connection.outbound, flight));
}

function pickBest(
  connection: Connection,
  flights: readonly Flight[],
  include: (flight: Flight) => boolean,
): Flight | undefined {
  let best: Flight | undefined;
  let bestScore = 0;
  for (const flight of flights) {
    if (!include(flight)) continue;
    const score = optionScore(connection, flight);
    if (
      !best ||
      score > bestScore ||
      (score === bestScore && flight.flightNumber.localeCompare(best.flightNumber) < 0)
    ) {
      best = flight;
      bestScore = score;
    }
  }
  return best;
}

function pickNextCx(flights: readonly Flight[], include: (flight: Flight) => boolean): Flight | undefined {
  let best: Flight | undefined;
  let bestTime = 0;
  for (const flight of flights) {
    if (!include(flight)) continue;
    const time = Date.parse(flight.actualDeparture);
    if (
      !best ||
      time < bestTime ||
      (time === bestTime && flight.flightNumber.localeCompare(best.flightNumber) < 0)
    ) {
      best = flight;
      bestTime = time;
    }
  }
  return best;
}

function isViable(connection: Connection, candidate: Flight): boolean {
  if (candidate.flightNumber === connection.outbound.flightNumber) return false;
  if (candidate.origin !== "HKG") return false;
  if (candidate.destination !== connection.outbound.destination) return false;
  if (isUnaccompaniedMinor(connection.passenger) && candidate.airline !== "CX") return false;
  if (
    isUnaccompaniedMinor(connection.passenger) &&
    hkgCalendarDay(candidate.actualDeparture) !== hkgCalendarDay(connection.outbound.actualDeparture)
  ) {
    return false;
  }
  if (!partySeating(candidate, connection.passenger)) return false;
  const available = minutesBetween(connection.inbound.actualArrival, candidate.actualDeparture);
  return available >= requiredMinutesFor(connection.inbound.airline, candidate.airline, connection.passenger);
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
    viable,
    (flight) => hkgCalendarDay(flight.actualDeparture) === originalDay,
  );
  const chosen = new Set(sameDay ? [sameDay.flightNumber] : []);
  const nextCx = pickNextCx(
    viable,
    (flight) =>
      flight.airline === "CX" &&
      Date.parse(flight.actualDeparture) > originalDep &&
      !chosen.has(flight.flightNumber),
  );
  if (nextCx) chosen.add(nextCx.flightNumber);
  const partner = pickBest(
    connection,
    viable,
    (flight) =>
      isOneworldAirline(flight.airline) &&
      flight.airline !== "CX" &&
      !chosen.has(flight.flightNumber),
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
