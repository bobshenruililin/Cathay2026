import { formatHkgIso } from "./iso";
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

function clock(iso: string): string {
  return formatHkgIso(Date.parse(iso)).slice(11, 16);
}

function passengerNotes(connection: Connection): string[] {
  const lines: string[] = [];
  if (needsWheelchair(connection.passenger)) {
    lines.push(
      `Wheelchair assistance adds ${WHEELCHAIR_TRANSIT_BUFFER_MINUTES} minutes of gate transit on top of the HKG MCT table.`,
    );
  }
  if (isUnaccompaniedMinor(connection.passenger)) {
    lines.push(
      `Unaccompanied minor: ${UM_ESCORT_BUFFER_MINUTES} minutes of staff escort. Keep them on CX today; do not overnight them in HKG.`,
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
    `${connection.inbound.flightNumber} arrives ${clock(connection.inbound.actualArrival)}; ${connection.outbound.flightNumber} departs ${clock(connection.outbound.actualDeparture)}.`,
    `They have ${slack} minutes between arrival and departure. We need ${required} minutes including walk time and any wheelchair or escort buffer.`,
    missed
      ? "This connection is missed: they do not have the HKG minimum."
      : tight
        ? "This connection is tight: legal, but within 20 minutes of the minimum, so the passenger is at risk."
        : "This connection is healthy: slack clears MCT and the tight window.",
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
