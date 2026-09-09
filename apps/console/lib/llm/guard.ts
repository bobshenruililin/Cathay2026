import type { Flight, RecoveryOption } from "engine";

/** IATA-style numbers: CX254, BA32, UO102, JL26, IB6822, AA204. */
const IATA_FLIGHT = /\b(?:[A-Z]{2}|[A-Z][0-9]|[0-9][A-Z])[0-9]{1,4}[A-Z]?\b/gi;

export function extractFlightNumbers(text: string): string[] {
  const matches = text.toUpperCase().match(IATA_FLIGHT) ?? [];
  return [...new Set(matches.map((value) => value.toUpperCase()))];
}

export type GuardContext = {
  inbound: Flight;
  outbound: Flight;
  option: RecoveryOption;
};

export function allowedFlightNumbers(input: GuardContext): Set<string> {
  const allowed = new Set<string>();
  const add = (value: string | undefined) => {
    if (!value) return;
    for (const number of extractFlightNumbers(value)) allowed.add(number);
  };
  add(input.option.flight.flightNumber);
  add(input.inbound.flightNumber);
  add(input.outbound.flightNumber);
  add(input.option.flight.origin);
  add(input.option.flight.destination);
  add(input.option.flight.gate);
  add(input.option.flight.airline);
  for (const line of input.option.reasoning) add(line);
  return allowed;
}

export function hhmm(iso: string): string {
  return iso.slice(11, 16);
}

export function fallbackTemplate(input: GuardContext): string {
  const original = input.outbound.flightNumber;
  const recovery = input.option.flight.flightNumber;
  const departing = hhmm(input.option.flight.actualDeparture);
  return `[Cathay Alert] Your flight ${original} has been protected on ${recovery} departing at ${departing}.`;
}

export function applyFlightNumberGuard(
  text: string,
  input: GuardContext,
): { text: string; usedFallback: boolean } {
  const allowed = allowedFlightNumbers(input);
  const mentioned = extractFlightNumbers(text);
  const hallucinated = mentioned.some((number) => !allowed.has(number));
  if (hallucinated || text.trim() === "") {
    return { text: fallbackTemplate(input), usedFallback: true };
  }
  return { text: text.trim(), usedFallback: false };
}
