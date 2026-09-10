import { triageConnection, type Flight, type Passenger } from "engine";
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

export type TriageRow = {
  inboundFlightNumber: string;
  outboundFlightNumber: string;
  passenger: Passenger;
};

/** At-risk rows stay the action queue. Healthy connections are counted, not acted on. */
export function collectTriage(
  rows: TriageRow[],
  flights: Flight[],
  resolved: Set<string> = new Set(),
): { queue: QueueItem[]; quietCount: number } {
  const lookup = flightsByNumber(flights);
  const queue: QueueItem[] = [];
  let quietCount = 0;
  for (const row of rows) {
    if (resolved.has(row.passenger.pnr)) continue;
    const inbound = lookup.get(row.inboundFlightNumber);
    const outbound = lookup.get(row.outboundFlightNumber);
    if (!inbound || !outbound) continue;
    const result = triageConnection({ inbound, outbound, passenger: row.passenger }, flights);
    if (!result.atRisk) {
      quietCount += 1;
      continue;
    }
    queue.push({ result, passenger: row.passenger, inbound, outbound });
  }
  return { queue: sortQueue(queue), quietCount };
}

export function disruptionFrom(queue: QueueItem[], flights: Flight[], quietCount: number) {
  const delayedFlights = flights.filter((flight) => flight.delayMinutes > 0).length;
  const atRiskCount = queue.length;
  const label =
    atRiskCount === 0
      ? "Normal operations"
      : `${atRiskCount} at-risk connection${atRiskCount === 1 ? "" : "s"}`;
  return { label, atRiskCount, delayedFlights, quietCount };
}
