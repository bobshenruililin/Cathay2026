import type { ConnectionStatus, LoyaltyTier, TriageResult } from "engine";
import type { Flight, Passenger, RecoveryOption } from "engine";

export type Locale = "en" | "zh-Hant" | "ja";

export type QueueItem = {
  result: TriageResult;
  passenger: Passenger;
  inbound: Flight;
  outbound: Flight;
};

export type DisruptionStatus = {
  label: string;
  atRiskCount: number;
  delayedFlights: number;
};

export type ConsoleSnapshot = {
  clockIso: string;
  disruption: DisruptionStatus;
  queue: QueueItem[];
  flights: Flight[];
};

export type ConsoleAdapter = {
  load(): Promise<ConsoleSnapshot>;
  advanceClock(minutes: number): Promise<ConsoleSnapshot>;
  injectDelay(flightNumber: string, delayMinutes: number): Promise<ConsoleSnapshot>;
  approveRebooking(pnr: string, option: RecoveryOption, message: string): Promise<ConsoleSnapshot>;
};

export const TIER_RANK: Record<LoyaltyTier, number> = {
  Diamond: 4,
  Gold: 3,
  Silver: 2,
  Green: 1,
};

export const SEVERITY_RANK: Record<ConnectionStatus, number> = {
  missed: 0,
  tight: 1,
  ok: 2,
  invalid: 3,
};
