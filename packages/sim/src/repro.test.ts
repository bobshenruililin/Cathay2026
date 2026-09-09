import { describe, expect, it } from "vitest";
import { createPrng, hashSeed } from "./prng.ts";
import { createSimulation } from "./simulation.ts";

function play(seed: string | number): { state: string; events: string } {
  const sim = createSimulation(seed);
  const first = sim.getState().flights[0];
  if (!first) throw new Error("empty bank");
  const events: unknown[] = [];
  const stop = sim.subscribe((event) => events.push(event));
  sim.advanceClock(45);
  sim.injectFlightDelay(first.flightNumber, 25);
  sim.advanceClock(120);
  stop();
  return { state: JSON.stringify(sim.getState()), events: JSON.stringify(events) };
}

describe("seeded prng", () => {
  it("replays the same stream", () => {
    const a = createPrng(99);
    const b = createPrng(99);
    expect(a.next()).toBe(b.next());
    expect(a.next()).toBe(b.next());
    expect(hashSeed("cx")).toBe(hashSeed("cx"));
    expect(createPrng("cx").next()).not.toBe(createPrng("uo").next());
  });
});

describe("simulation reproducibility", () => {
  it("is byte-identical for the same seed, including delays and clock", () => {
    expect(JSON.stringify(createSimulation(42).getState())).toBe(
      JSON.stringify(createSimulation(42).getState()),
    );
    const a = play(42);
    const b = play(42);
    expect(a.state).toBe(b.state);
    expect(a.events).toBe(b.events);
    expect(play("hkg").state).toBe(play("hkg").state);
    expect(play(42).state).not.toBe(play(43).state);
  });

  it("flags newly at-risk passengers through engine after a delay", () => {
    const sim = createSimulation(7);
    const before = new Set(sim.getState().atRisk.map((row) => row.pnr));
    const inbound = sim.getState().flights.find((f) => f.destination === "HKG");
    if (!inbound) throw new Error("no inbound");
    const events = sim.injectFlightDelay(inbound.flightNumber, 240);
    const after = sim.getState();
    const newly = events.filter((e) => e.type === "newly_at_risk");
    expect(after.flights.find((f) => f.flightNumber === inbound.flightNumber)?.delayMinutes).toBe(240);
    expect(newly.length).toBeGreaterThan(0);
    for (const event of newly) {
      if (event.type !== "newly_at_risk") continue;
      expect(before.has(event.result.pnr)).toBe(false);
      expect(event.result.atRisk).toBe(true);
      expect(event.result.reasoning.length).toBeGreaterThan(0);
    }
  });

  it("emits clock and status events, then unsubscribes", () => {
    const sim = createSimulation(3);
    const seen: string[] = [];
    const stop = sim.subscribe((event) => seen.push(event.type));
    sim.advanceClock(0);
    sim.advanceClock(600);
    stop();
    const afterUnsub = seen.length;
    sim.advanceClock(10);
    expect(seen).toContain("clock");
    expect(seen.length).toBe(afterUnsub);
  });

  it("rejects negative clock moves and unknown flights", () => {
    const sim = createSimulation(1);
    expect(() => sim.advanceClock(-1)).toThrow(/negative/);
    expect(() => sim.injectFlightDelay("NOPE1", 10)).toThrow(/Unknown flight/);
  });
});
