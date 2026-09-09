import type { Flight } from "engine";
import { SEVERITY_RANK, TIER_RANK, type QueueItem } from "./types";

export function flightsByNumber(flights: Flight[]): Map<string, Flight> {
  return new Map(flights.map((flight) => [flight.flightNumber, flight]));
}

export function sortQueue(items: QueueItem[]): QueueItem[] {
  return [...items].sort((left, right) => {
    const severity = SEVERITY_RANK[left.result.status] - SEVERITY_RANK[right.result.status];
    if (severity !== 0) return severity;
    const tier = TIER_RANK[right.passenger.tier] - TIER_RANK[left.passenger.tier];
    if (tier !== 0) return tier;
    return left.passenger.pnr < right.passenger.pnr ? -1 : 1;
  });
}

export function disruptionFrom(queue: QueueItem[], flights: Flight[]) {
  const delayedFlights = flights.filter((flight) => flight.delayMinutes > 0).length;
  const atRiskCount = queue.length;
  const label =
    atRiskCount === 0
      ? "Normal operations"
      : `${atRiskCount} at-risk connection${atRiskCount === 1 ? "" : "s"}`;
  return { label, atRiskCount, delayedFlights };
}
