import {
  connectionRequiredMinutes,
  connectionStatus,
  isAtRisk,
  isValidItinerary,
  slackMinutes,
} from "./feasibility";
import { UM_ESCORT_BUFFER_MINUTES, WHEELCHAIR_TRANSIT_BUFFER_MINUTES } from "./mct";
import { generateOptions } from "./options";
import { isUnaccompaniedMinor, needsWheelchair, partySizeOf } from "./passenger";
import type { Connection, Flight, TriageResult } from "./types";

function passengerNotes(connection: Connection): string[] {
  const lines: string[] = [];
  if (needsWheelchair(connection.passenger)) {
    lines.push(
      `Wheelchair assistance adds ${WHEELCHAIR_TRANSIT_BUFFER_MINUTES} min gate transit on top of the HKG MCT table.`,
    );
  }
  if (isUnaccompaniedMinor(connection.passenger)) {
    lines.push(
      `Unaccompanied minor: ${UM_ESCORT_BUFFER_MINUTES} min staff-escort buffer; recovery options stay on CX metal.`,
    );
  }
  const size = partySizeOf(connection.passenger);
  if (size > 1) {
    lines.push(`Party of ${size} on one PNR cannot be split across different flights.`);
  }
  return lines;
}

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
    ...passengerNotes(connection),
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
