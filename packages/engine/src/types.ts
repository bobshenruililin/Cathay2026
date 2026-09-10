export type CabinClass = "First" | "Business" | "Premium Economy" | "Economy";

export type LoyaltyTier = "Diamond" | "Gold" | "Silver" | "Green";

export type FlightStatus = "scheduled" | "departed" | "arrived" | "delayed";

export type CabinSeats = {
  First: number;
  Business: number;
  "Premium Economy": number;
  Economy: number;
};

export type Flight = {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture: string;
  actualArrival: string;
  delayMinutes: number;
  status: FlightStatus;
  gate: string;
  seats: CabinSeats;
};

export type Passenger = {
  pnr: string;
  name: string;
  tier: LoyaltyTier;
  cabin: CabinClass;
  /** Unaccompanied minor. Default false when omitted. */
  um?: boolean;
  /** Wheelchair / PRM assistance. Default false when omitted. */
  wheelchair?: boolean;
  /** IATA SSR codes (UMNR, WCHR, WCHS, WCHC). Flags and SSR do not stack. */
  ssr?: string[];
  /** Desk reference for a travelling group. Echoed in reasoning only. */
  partyId?: string;
  /** Party size on this PNR. Default 1 when omitted. Cannot split across flights. */
  partySize?: number;
};

export type Connection = {
  inbound: Flight;
  outbound: Flight;
  passenger: Passenger;
};

export type RecoveryOption = {
  flight: Flight;
  score: number;
  delayMinutes: number;
  seatMatch: boolean;
  offeredCabin: CabinClass;
  downgradeProtected: boolean;
  reasoning: string[];
};

export type DisruptionEvent = {
  kind: "delay" | "at_risk";
  flightNumber: string;
  delayMinutes: number;
  clockIso: string;
  reasoning: string[];
};

export type ConnectionStatus = "ok" | "tight" | "missed" | "invalid";

export type TriageResult = {
  pnr: string;
  inboundFlightNumber: string;
  outboundFlightNumber: string;
  feasible: boolean;
  atRisk: boolean;
  status: ConnectionStatus;
  slackMinutes: number;
  requiredMinutes: number;
  options: RecoveryOption[];
  reasoning: string[];
};
