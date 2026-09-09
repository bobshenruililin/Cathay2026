import { addMinutesIso, triageConnection } from "engine";
import type { Flight } from "engine";
import { CX254_DELAY_MINUTES, TYPHOON_DELAY_MINUTES } from "sim";
import { seedFlights, seedLinks, type Link } from "./mock-bank";
import { disruptionFrom, flightsByNumber, sortQueue } from "./queue";
import type { ConsoleAdapter, ConsoleSnapshot, QueueItem } from "./types";

function cloneFlights(flights: Flight[]): Flight[] {
  return JSON.parse(JSON.stringify(flights)) as Flight[];
}

function snapshot(clockIso: string, flights: Flight[], links: Link[]): ConsoleSnapshot {
  const lookup = flightsByNumber(flights);
  const queue: QueueItem[] = [];
  for (const link of links) {
    const inbound = lookup.get(link.inboundFlightNumber);
    const outbound = lookup.get(link.outboundFlightNumber);
    if (!inbound || !outbound) continue;
    const result = triageConnection({ inbound, outbound, passenger: link.passenger }, flights);
    if (!result.atRisk) continue;
    queue.push({ result, passenger: link.passenger, inbound, outbound });
  }
  return {
    clockIso,
    flights,
    queue: sortQueue(queue),
    disruption: disruptionFrom(queue, flights),
  };
}

function applyDelay(flights: Flight[], flightNumber: string, delayMinutes: number): Flight[] {
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
  return flights.map((flight, i) => (i === index ? updated : flight));
}

/** In-process seam. Live console uses createSimAdapter instead. */
export function createMockAdapter(): ConsoleAdapter {
  let clockIso = "2026-11-16T20:00:00+08:00";
  let flights = cloneFlights(seedFlights());
  let links = seedLinks();

  return {
    async load() {
      return snapshot(clockIso, flights, links);
    },
    async advanceClock(minutes: number) {
      if (minutes < 0) throw new Error("Cannot rewind the station clock");
      clockIso = addMinutesIso(clockIso, minutes);
      const clock = Date.parse(clockIso);
      flights = flights.map((flight) => {
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
      flights = applyDelay(flights, flightNumber, delayMinutes);
      return snapshot(clockIso, flights, links);
    },
    async simulateTyphoonDelay() {
      for (const flight of flights.filter((row) => row.destination === "HKG")) {
        flights = applyDelay(flights, flight.flightNumber, TYPHOON_DELAY_MINUTES);
      }
      return snapshot(clockIso, flights, links);
    },
    async lateInboundCx254() {
      const inbound =
        flights.find((flight) => flight.flightNumber === "CX254" && flight.destination === "HKG") ??
        flights.find((flight) => flight.destination === "HKG");
      if (!inbound) throw new Error("No inbound flight available for Late Inbound CX254");
      flights = applyDelay(flights, inbound.flightNumber, CX254_DELAY_MINUTES);
      return snapshot(clockIso, flights, links);
    },
    async approveRebooking(pnr: string) {
      links = links.filter((link) => link.passenger.pnr !== pnr);
      return snapshot(clockIso, flights, links);
    },
  };
}
