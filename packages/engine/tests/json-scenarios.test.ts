import { describe, expect, it } from "vitest";
import { generateOptions, triageConnection } from "../src/index";
import { hydrateConnection, hydrateFlight, loadScenarioFiles } from "./scenario-json";

const fixtures = loadScenarioFiles();

describe("JSON scenario fixtures", () => {
  it("loads a hand-readable bank", () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(10);
    const ids = fixtures.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(fixtures)("$id — $title", (fixture) => {
    const connection = hydrateConnection(fixture);
    const pool = fixture.pool.map((flight) => hydrateFlight(flight, "out"));
    const result = triageConnection(connection, pool);
    const options = generateOptions(connection, pool);
    expect(result.status).toBe(fixture.expected.status);
    expect(result.atRisk).toBe(fixture.expected.atRisk);
    if (fixture.expected.feasible !== undefined) {
      expect(result.feasible).toBe(fixture.expected.feasible);
    }
    expect(result.options.map((o) => o.flight.flightNumber)).toEqual(fixture.expected.optionFlightNumbers);
    expect(options.map((o) => o.flight.flightNumber)).toEqual(fixture.expected.optionFlightNumbers);
    for (const needle of fixture.expected.triageReasoningIncludes ?? []) {
      expect(result.reasoning.join(" ")).toContain(needle);
    }
    const optionText = result.options.map((o) => o.reasoning.join(" ")).join(" ");
    for (const needle of fixture.expected.optionReasoningIncludes ?? []) {
      expect(optionText).toContain(needle);
    }
    for (const option of result.options) {
      for (const line of option.reasoning) {
        expect(line).toMatch(/[.!]$/);
        expect(line).not.toMatch(/Score \d+ =/);
      }
    }
  });
});
