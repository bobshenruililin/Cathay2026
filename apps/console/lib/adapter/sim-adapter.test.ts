import { describe, expect, it } from "vitest";
import { createSimAdapter } from "./sim-adapter";

describe("sim adapter", () => {
  it("loads a live queue from sim + engine", async () => {
    const adapter = createSimAdapter();
    const snap = await adapter.load();
    expect(snap.clockIso).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(snap.flights.some((flight) => flight.flightNumber === "CX254" && flight.destination === "HKG")).toBe(
      true,
    );
    expect(snap.queue.length).toBe(snap.disruption.atRiskCount);
    for (const item of snap.queue) {
      expect(item.result.atRisk).toBe(true);
      expect(item.result.reasoning.length).toBeGreaterThan(0);
    }
  });

  it("updates the queue immediately after typhoon and CX254 delays", async () => {
    const adapter = createSimAdapter();
    const before = await adapter.load();
    const typhoon = await adapter.simulateTyphoonDelay();
    expect(typhoon.disruption.delayedFlights).toBeGreaterThan(before.disruption.delayedFlights);
    expect(typhoon.clockIso).toBe(before.clockIso);

    const cx = await adapter.lateInboundCx254();
    const inbound = cx.flights.find((flight) => flight.flightNumber === "CX254");
    expect(inbound?.destination).toBe("HKG");
    expect(inbound?.delayMinutes).toBeGreaterThan(0);
    expect(cx.queue.some((item) => item.inbound.flightNumber === "CX254")).toBe(true);
    expect(cx.disruption.atRiskCount).toBeGreaterThan(0);
    expect(cx.queue.some((item) => item.result.options.length > 0)).toBe(true);
  });

  it("advances the sim clock rather than wall time", async () => {
    const adapter = createSimAdapter();
    const before = await adapter.load();
    const after = await adapter.advanceClock(15);
    expect(Date.parse(after.clockIso)).toBe(Date.parse(before.clockIso) + 15 * 60_000);
  });
});
