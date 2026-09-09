import {
  connectionRequiredMinutes,
  connectionStatus,
  isAtRisk,
  isValidItinerary,
  slackMinutes,
} from "./feasibility";
import { generateOptions } from "./options";
import type { Connection, Flight, TriageResult } from "./types";

export function triageConnection(
  connection: Connection,
  pool: readonly Flight[] = [],
): TriageResult {
  const base = {
    pnr: connection.passenger.pnr,
    inboundFlightNumber: connection.inbound.flightNumber,
    outboundFlightNumber: connection.outbound.flightNumber,
    options: [] as TriageResult["options"],
  };

  if (!isValidItinerary(connection)) {
    return {
      ...base,
      feasible: false,
      atRisk: false,
      status: "invalid" as const,
      slackMinutes: 0,
      requiredMinutes: 0,
      reasoning: [
        "Itinerary is invalid: both flights must meet at HKG, use distinct flight numbers, and have parseable times.",
      ],
    };
  }

  const slack = slackMinutes(connection);
  const required = connectionRequiredMinutes(connection);
  const status = connectionStatus(connection);
  const missed = status === "missed";
  const tight = status === "tight";
  const atRisk = isAtRisk(connection);
  const options = atRisk ? generateOptions(connection, pool) : [];
  const reasoning = [
    `${connection.inbound.flightNumber} arrives ${connection.inbound.actualArrival}; ${connection.outbound.flightNumber} departs ${connection.outbound.actualDeparture}.`,
    `Slack is ${slack} minutes; HKG MCT plus gate-walk buffer requires ${required} minutes.`,
    missed
      ? "Connection is missed: slack is below the required minimum."
      : tight
        ? "Connection is tight: feasible but within 20 minutes of the minimum, so the passenger is at risk."
        : "Connection is healthy: slack clears MCT and the tight window.",
  ];
  return {
    ...base,
    feasible: status !== "missed",
    atRisk,
    status,
    slackMinutes: slack,
    requiredMinutes: required,
    options,
    reasoning,
  };
}
