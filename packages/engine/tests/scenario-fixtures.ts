import { addMinutesIso } from "../src/iso";
import { INBOUND, makeConnection, makeFlight, makePassenger } from "../src/fixtures";
import type { CabinSeats, Flight, Passenger } from "../src/types";

export const ARR = INBOUND.actualArrival;

export function seats(partial: Partial<CabinSeats> = {}): CabinSeats {
  return { First: 0, Business: 0, "Premium Economy": 0, Economy: 0, ...partial };
}

export function out(
  num: string,
  airline: string,
  depOffset: number,
  cabinSeats?: CabinSeats,
): Flight {
  return makeFlight(
    num,
    airline,
    "HKG",
    "LHR",
    addMinutesIso(ARR, depOffset),
    addMinutesIso(ARR, depOffset + 780),
    cabinSeats,
  );
}

export function pax(
  extras: Partial<Pick<Passenger, "um" | "wheelchair" | "partySize" | "cabin" | "tier" | "pnr">> = {},
): Passenger {
  return makePassenger(extras.pnr ?? "EDGE01", extras.tier ?? "Gold", extras.cabin ?? "Business", extras);
}

export function link(passenger: Passenger, outbound: Flight) {
  return makeConnection(INBOUND, outbound, passenger);
}

export const FULL = seats({ First: 4, Business: 20, "Premium Economy": 24, Economy: 140 });
export const BIZ_GONE = seats({ "Premium Economy": 20, Economy: 140 });
export const ONLY_ECONOMY = seats({ Economy: 140 });
export const EMPTY = seats();
export const TWO_BIZ = seats({ Business: 2, Economy: 2 });
export const FOUR_ECONOMY = seats({ Economy: 4 });
