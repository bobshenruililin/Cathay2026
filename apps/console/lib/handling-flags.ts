import { isUnaccompaniedMinor, needsWheelchair, partySizeOf, type Passenger } from "engine";

export function handlingFlags(passenger: Passenger): string[] {
  const flags: string[] = [];
  if (isUnaccompaniedMinor(passenger)) flags.push("UM");
  if (needsWheelchair(passenger)) flags.push("WCH");
  const size = partySizeOf(passenger);
  if (size > 1) flags.push(`party of ${size}`);
  return flags;
}
