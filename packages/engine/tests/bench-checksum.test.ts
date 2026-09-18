import { describe, expect, it } from "vitest";
import { generateOptions, extraTransitMinutes, requiredMinutes, requiredMinutesFor, triageConnection } from "../src/index";
import { observeOption, observeTriage } from "../bench/canonical";
import { CARRIERS, extraTransitShapes, freshMatrix } from "../bench/matrix";
import { referenceOptions } from "../bench/reference";
import { referenceTriage } from "../bench/reference-triage";
import { GOLDEN, loadWorkload } from "../bench/workload";

describe("engine bench observations", () => {
  it("deep-equals full options and triage against the sort reference on the matrix", () => {
    const matrix = freshMatrix();
    expect(matrix.length).toBeGreaterThan(50);
    for (const cell of matrix) {
      expect(generateOptions(cell.connection, cell.pool).map(observeOption), cell.id).toEqual(
        referenceOptions(cell.connection, cell.pool).map(observeOption),
      );
      expect(observeTriage(triageConnection(cell.connection, cell.pool)), cell.id).toEqual(
        observeTriage(referenceTriage(cell.connection, cell.pool)),
      );
    }
  });

  it("covers carriers, cabin, seats, UM/WCH/SSR/party, overnight, CX and non-CX", () => {
    const matrix = freshMatrix();
    const blob = JSON.stringify(matrix);
    for (const needle of ["CX", "UO", "BA", "QF", "JL", "AA", "5J", "UMNR", "WCHR", "WCHS", "WCHC", "COLE", "First", "Premium Economy"]) {
      expect(blob, needle).toContain(needle);
    }
    expect(blob).toContain("2026-11-17");
    expect(matrix.some((cell) => cell.connection.passenger.um === true)).toBe(true);
    expect(matrix.some((cell) => cell.connection.passenger.wheelchair === true)).toBe(true);
    expect(matrix.some((cell) => (cell.connection.passenger.partySize ?? 1) > 1)).toBe(true);
    expect(matrix.some((cell) => cell.connection.inbound.airline === "5J")).toBe(true);
    expect(matrix.some((cell) => cell.pool.some((flight) => flight.origin !== "HKG"))).toBe(true);
    const a = freshMatrix()[0]!;
    const b = freshMatrix()[0]!;
    expect(a.connection).not.toBe(b.connection);
    expect(a.pool[0]).not.toBe(b.pool[0]);
  });

  it("locks SHA-256 of full observed outputs", () => {
    const got: Record<string, string> = {};
    for (const kernel of loadWorkload()) got[kernel.name] = kernel.run();
    expect(got).toEqual(GOLDEN);
  });

  it("required/extra tables are complete carrier × passenger grids", () => {
    expect(CARRIERS).toContain("CX");
    expect(CARRIERS).toContain("5J");
    const shapes = extraTransitShapes();
    expect(shapes.length).toBeGreaterThanOrEqual(10);
    expect(requiredMinutes("CX", "CX")).toBe(60);
    expect(requiredMinutesFor("CX", "CX", { um: true, wheelchair: true })).toBe(95);
    expect(extraTransitMinutes({ ssr: ["UMNR", "WCHS"] })).toBe(35);
  });
});
