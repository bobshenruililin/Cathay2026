import { addMinutesIso, triageConnection } from "engine";
import type { Flight } from "engine";
import { seedFlights, seedLinks, type Link } from "./mock-bank";
import { SEVERITY_RANK, TIER_RANK, type ConsoleAdapter, type ConsoleSnapshot, type QueueItem } from "./types";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cloneFlights(flights: Flight[]): Flight[] {
  return JSON.parse(JSON.stringify(flights)) as Flight[];
}

function byNumber(flights: Flight[]): Map<string, Flight> {
  return new Map(flights.map((flight) => [flight.flightNumber, flight]));
}

function sortQueue(items: QueueItem[]): QueueItem[] {
  return [...items].sort((left, right) => {
    const severity = SEVERITY_RANK[left.result.status] - SEVERITY_RANK[right.result.status];
    if (severity !== 0) return severity;
    const tier = TIER_RANK[right.passenger.tier] - TIER_RANK[left.passenger.tier];
    if (tier !== 0) return tier;
    return left.passenger.pnr < right.passenger.pnr ? -1 : 1;
  });
}

function snapshot(clockIso: string, flights: Flight[], links: Link[]): ConsoleSnapshot {
  const lookup = byNumber(flights);
  const queue: QueueItem[] = [];
  for (const link of links) {
    const inbound = lookup.get(link.inboundFlightNumber);
    const outbound = lookup.get(link.outboundFlightNumber);
    if (!inbound || !outbound) continue;
    const result = triageConnection({ inbound, outbound, passenger: link.passenger }, flights);
    if (!result.atRisk) continue;
    queue.push({ result, passenger: link.passenger, inbound, outbound });
  }
  const delayedFlights = flights.filter((flight) => flight.delayMinutes > 0).length;
  const atRiskCount = queue.length;
  const label =
    atRiskCount === 0
      ? "Normal operations"
      : `${atRiskCount} at-risk connection${atRiskCount === 1 ? "" : "s"}`;
  return {
    clockIso,
    flights,
    queue: sortQueue(queue),
    disruption: { label, atRiskCount, delayedFlights },
  };
}

export function createMockAdapter(): ConsoleAdapter {
  let clockIso = "2026-11-16T20:00:00+08:00";
  let flights = cloneFlights(seedFlights());
  let links = seedLinks();

  return {
    async load() {
      await wait(220);
      return snapshot(clockIso, flights, links);
    },
    async advanceClock(minutes: number) {
      await wait(160);
      if (minutes < 0) throw new Error("Cannot rewind the station clock");
      clockIso = addMinutesIso(clockIso, minutes);
      flights = flights.map((flight) => {
        const clock = Date.parse(clockIso);
        const status =
          clock >= Date.parse(flight.actualArrival)
            ? "arrived"
            : clock >= Date.parse(flight.actualDeparture)
              ? "departed"
              : flight.delayMinutes > 0
                ? "delayed"
                : "scheduled";
        return { ...flight, status };
      });
      return snapshot(clockIso, flights, links);
    },
    async injectDelay(flightNumber: string, delayMinutes: number) {
      await wait(180);
      const index = flights.findIndex((flight) => flight.flightNumber === flightNumber);
      if (index < 0) throw new Error(`Unknown flight ${flightNumber}`);
      const current = flights[index]!;
      const delay = current.delayMinutes + delayMinutes;
      const updated: Flight = {
        ...current,
        delayMinutes: delay,
        actualDeparture: addMinutesIso(current.scheduledDeparture, delay),
        actualArrival: addMinutesIso(current.scheduledArrival, delay),
        status: "delayed",
      };
      flights = flights.map((flight, i) => (i === index ? updated : flight));
      return snapshot(clockIso, flights, links);
    },
    async approveRebooking(pnr: string) {
      await wait(200);
      links = links.filter((link) => link.passenger.pnr !== pnr);
      return snapshot(clockIso, flights, links);
    },
  };
}
