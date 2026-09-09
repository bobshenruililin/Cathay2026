const ONEWORLD = new Set([
  "AA",
  "AS",
  "AT",
  "AY",
  "BA",
  "CX",
  "FJ",
  "IB",
  "JL",
  "MH",
  "OM",
  "QF",
  "QR",
  "RJ",
  "UL",
  "WY",
]);

export type CarrierFamily = "CX" | "UO" | "ONEWORLD" | "OTHER";

/** HKG MCT in minutes. Single source of truth for connection feasibility. */
export const HKG_MCT_MINUTES: Record<`${CarrierFamily}_${CarrierFamily}`, number> = {
  CX_CX: 50,
  CX_UO: 70,
  CX_ONEWORLD: 60,
  CX_OTHER: 80,
  UO_CX: 70,
  UO_UO: 55,
  UO_ONEWORLD: 75,
  UO_OTHER: 80,
  ONEWORLD_CX: 60,
  ONEWORLD_UO: 75,
  ONEWORLD_ONEWORLD: 60,
  ONEWORLD_OTHER: 80,
  OTHER_CX: 80,
  OTHER_UO: 80,
  OTHER_ONEWORLD: 80,
  OTHER_OTHER: 80,
};

export const GATE_WALK_BUFFER_MINUTES = 10;

export const TIGHT_SLACK_EXTRA_MINUTES = 20;

/**
 * Extra HKG gate transit for wheelchair / PRM assistance.
 * Additive on top of the MCT table; HKG_MCT_MINUTES stays the single source of truth.
 */
export const WHEELCHAIR_TRANSIT_BUFFER_MINUTES = 15;

/** Extra staff-escort time for unaccompanied minors. Additive on top of the MCT table. */
export const UM_ESCORT_BUFFER_MINUTES = 20;

export function isOneworldAirline(airline: string): boolean {
  return ONEWORLD.has(airline);
}

export function carrierFamily(airline: string): CarrierFamily {
  if (airline === "CX") return "CX";
  if (airline === "UO") return "UO";
  if (isOneworldAirline(airline)) return "ONEWORLD";
  return "OTHER";
}

export function hkgMctMinutes(inboundAirline: string, outboundAirline: string): number {
  const key = `${carrierFamily(inboundAirline)}_${carrierFamily(outboundAirline)}` as const;
  return HKG_MCT_MINUTES[key]!;
}

export function requiredMinutes(inboundAirline: string, outboundAirline: string): number {
  return hkgMctMinutes(inboundAirline, outboundAirline) + GATE_WALK_BUFFER_MINUTES;
}

export function extraTransitMinutes(passenger: {
  um?: boolean;
  wheelchair?: boolean;
}): number {
  return (
    (passenger.wheelchair === true ? WHEELCHAIR_TRANSIT_BUFFER_MINUTES : 0) +
    (passenger.um === true ? UM_ESCORT_BUFFER_MINUTES : 0)
  );
}

/** MCT table + gate walk, plus documented passenger buffers (wheelchair, UM). */
export function requiredMinutesFor(
  inboundAirline: string,
  outboundAirline: string,
  passenger: { um?: boolean; wheelchair?: boolean },
): number {
  return requiredMinutes(inboundAirline, outboundAirline) + extraTransitMinutes(passenger);
}
