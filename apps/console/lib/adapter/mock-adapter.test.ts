import { describe, expect, it } from "vitest";
import { CX254_DELAY_MINUTES, TYPHOON_DELAY_MINUTES } from "sim";
import { createMockAdapter } from "./mock-adapter";

describe("mock adapter", () => {
  it("shares typhoon and CX254 delay constants with sim", async () => {
    const adapter = createMockAdapter();
    const typhoon = await adapter.simulateTyphoonDelay();
    const inbound = typhoon.flights.find(
      (flight) => flight.flightNumber === "CX254" && flight.destination === "HKG",
    );
    expect(inbound?.delayMinutes).toBe(TYPHOON_DELAY_MINUTES);

    const cx = await adapter.lateInboundCx254();
    const delayed = cx.flights.find(
      (flight) => flight.flightNumber === "CX254" && flight.destination === "HKG",
    );
    expect(delayed?.delayMinutes).toBe(TYPHOON_DELAY_MINUTES + CX254_DELAY_MINUTES);
  });

  it("surfaces UM, wheelchair, and party-of-4 reasoning from the engine", async () => {
    const adapter = createMockAdapter();
    const snap = await adapter.load();
    const text = snap.queue.flatMap((item) => item.result.reasoning).join(" ");
    expect(text).toMatch(/Unaccompanied minor/);
    expect(text).toMatch(/Wheelchair assistance/);
    expect(text).toMatch(/Party of 4 on one PNR cannot be split/);
  });
});
