import { TIGHT_SLACK_EXTRA_MINUTES, requiredMinutes } from "./mct";
import { minutesBetween } from "./iso";
import type { Connection, ConnectionStatus, Flight } from "./types";

export function inboundArrivalIso(flight: Flight): string {
  return flight.actualArrival;
}

export function outboundDepartureIso(flight: Flight): string {
  return flight.actualDeparture;
}

export function slackMinutes(connection: Connection): number {
  return minutesBetween(
    inboundArrivalIso(connection.inbound),
    outboundDepartureIso(connection.outbound),
  );
}

export function connectionRequiredMinutes(connection: Connection): number {
  return requiredMinutes(connection.inbound.airline, connection.outbound.airline);
}

export function isFeasible(connection: Connection): boolean {
  return slackMinutes(connection) >= connectionRequiredMinutes(connection);
}

export function isValidItinerary(connection: Connection): boolean {
  if (connection.inbound.destination !== "HKG") return false;
  if (connection.outbound.origin !== "HKG") return false;
  if (connection.inbound.flightNumber === "") return false;
  if (connection.outbound.flightNumber === "") return false;
  if (connection.inbound.flightNumber === connection.outbound.flightNumber) return false;
  if (Number.isNaN(Date.parse(connection.inbound.actualArrival))) return false;
  if (Number.isNaN(Date.parse(connection.outbound.actualDeparture))) return false;
  return true;
}

export function connectionStatus(connection: Connection): ConnectionStatus {
  if (!isValidItinerary(connection)) return "invalid";
  const slack = slackMinutes(connection);
  const required = connectionRequiredMinutes(connection);
  if (slack < required) return "missed";
  if (slack < required + TIGHT_SLACK_EXTRA_MINUTES) return "tight";
  return "ok";
}

export function isAtRisk(connection: Connection): boolean {
  const status = connectionStatus(connection);
  return status === "tight" || status === "missed";
}
