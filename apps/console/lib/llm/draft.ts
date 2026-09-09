import type { Flight, Passenger, RecoveryOption } from "engine";
import type { Locale } from "../adapter/types";
import { applyFlightNumberGuard, fallbackTemplate, hhmm } from "./guard";
import { DRAFT_SYSTEM_PROMPT, generateWithLlm } from "./provider";

export type DraftInput = {
  passenger: Passenger;
  inbound: Flight;
  outbound: Flight;
  option: RecoveryOption;
  locale: Locale;
};

export type DraftResult = {
  text: string;
  usedFallback: boolean;
};

export type DraftGenerate = (input: DraftInput, systemPrompt: string) => Promise<string>;

export { DRAFT_SYSTEM_PROMPT, fallbackTemplate };

export function localMockDraft(input: DraftInput, mode: "valid" | "hallucinate" = "valid"): string {
  const recovery = input.option.flight.flightNumber;
  const outbound = input.outbound.flightNumber;
  const dest = input.option.flight.destination;
  const dep = hhmm(input.option.flight.actualDeparture);
  const extra = mode === "hallucinate" ? " Ignore CX999." : "";
  return `Dear ${input.passenger.name}, ${outbound} is disrupted. We have protected you on ${recovery} to ${dest} departing ${dep}.${extra}`;
}

function userPrompt(input: DraftInput): string {
  const allowed = [
    input.inbound.flightNumber,
    input.outbound.flightNumber,
    input.option.flight.flightNumber,
  ].join(", ");
  return [
    `Passenger: ${input.passenger.name} (${input.passenger.tier}, ${input.passenger.cabin}).`,
    `Disrupted inbound: ${input.inbound.flightNumber} ${input.inbound.origin}→${input.inbound.destination}.`,
    `Disrupted outbound: ${input.outbound.flightNumber} ${input.outbound.origin}→${input.outbound.destination}.`,
    `Recovery: ${input.option.flight.flightNumber} to ${input.option.flight.destination} departing ${input.option.flight.actualDeparture} from gate ${input.option.flight.gate}.`,
    `Locale: ${input.locale}.`,
    `Use only these flight numbers: ${allowed}.`,
  ].join("\n");
}

export async function defaultGenerate(input: DraftInput, systemPrompt: string): Promise<string> {
  const fromApi = await generateWithLlm(systemPrompt, userPrompt(input));
  return fromApi ?? localMockDraft(input, "valid");
}

export async function draftNotification(
  input: DraftInput,
  deps?: { generate?: DraftGenerate },
): Promise<DraftResult> {
  const generate = deps?.generate ?? defaultGenerate;
  const raw = await generate(input, DRAFT_SYSTEM_PROMPT);
  return applyFlightNumberGuard(raw, input);
}
