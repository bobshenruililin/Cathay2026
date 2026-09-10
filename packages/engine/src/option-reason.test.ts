import { describe, expect, it } from "vitest";
import { delayReason, seatingReason, specialHandlingReasons } from "./option-reason";
import { INBOUND, makeFlight, makePassenger } from "./fixtures";
import { addMinutesIso } from "./iso";

const flight = makeFlight(
  "CX252",
  "CX",
  "HKG",
  "LHR",
  addMinutesIso(INBOUND.actualArrival, 90),
  addMinutesIso(INBOUND.actualArrival, 870),
);

describe("ConnectGuard action verbs in option reasoning", () => {
  it("Wait prefixes delay, Protect/Hold prefix seating, Escort prefixes UM", () => {
    const wait = delayReason(flight, 40, "CX250", INBOUND.actualArrival);
    expect(wait).toMatch(/^Wait:/);
    expect(wait).toMatch(/40 min from original CX250/);
    expect(wait).not.toMatch(/Overnight/);

    const protect = seatingReason(flight, makePassenger(), {
      offeredCabin: "Premium Economy",
      seatMatch: false,
      downgradeProtected: true,
    });
    expect(protect).toMatch(/^Protect:/);
    expect(protect).toMatch(/Downgrade protection/);

    const hold = seatingReason(flight, makePassenger("P4", "Gold", "Economy", { partySize: 4 }), {
      offeredCabin: "Economy",
      seatMatch: true,
      downgradeProtected: false,
    });
    expect(hold).toMatch(/^Hold:/);
    expect(hold).toMatch(/Unsplittable party of 4/);

    const escort = specialHandlingReasons(makePassenger("UM1", "Green", "Economy", { um: true })).join(" ");
    expect(escort).toMatch(/Escort:/);
    expect(escort).toMatch(/Unaccompanied minor/);
  });

  it("names a next-calendar-day alternative as overnight", () => {
    const nextDay = makeFlight(
      "CX800",
      "CX",
      "HKG",
      "LHR",
      addMinutesIso(INBOUND.actualArrival, 20 * 60),
      addMinutesIso(INBOUND.actualArrival, 20 * 60 + 780),
    );
    expect(delayReason(nextDay, 1130, "CX250", flight.actualDeparture)).toMatch(
      /Overnight option \(next calendar day\)/,
    );
  });
});
