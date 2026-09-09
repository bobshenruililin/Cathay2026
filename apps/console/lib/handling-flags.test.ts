import { describe, expect, it } from "vitest";
import type { Passenger } from "engine";
import { handlingFlags } from "./handling-flags";

const base: Passenger = { pnr: "A1", name: "Test", tier: "Green", cabin: "Economy" };

describe("handling flags from engine cases", () => {
  it("surfaces UM, wheelchair/SSR, and unsplittable party on the queue row", () => {
    expect(handlingFlags(base)).toEqual([]);
    expect(handlingFlags({ ...base, um: true })).toEqual(["UM"]);
    expect(handlingFlags({ ...base, ssr: ["WCHR"] })).toEqual(["WCH"]);
    expect(handlingFlags({ ...base, partySize: 4 })).toEqual(["party of 4"]);
    expect(handlingFlags({ ...base, um: true, wheelchair: true, partySize: 4 })).toEqual([
      "UM",
      "WCH",
      "party of 4",
    ]);
  });
});
