import { describe, expect, it } from "vitest";
import { generateOptions } from "../src/index";
import { observeOption } from "../bench/canonical";
import { freshMatrix } from "../bench/matrix";
import { referenceOptions } from "../bench/reference";

describe("generateOptions rank oracle", () => {
  it("matches the sort reference on full options across the deterministic matrix", () => {
    for (const cell of freshMatrix()) {
      const actual = generateOptions(cell.connection, cell.pool).map(observeOption);
      const expected = referenceOptions(cell.connection, cell.pool).map(observeOption);
      expect(actual, cell.id).toEqual(expected);
      for (const option of actual) {
        expect(option.flight.flightNumber).toBeTruthy();
        expect(option.flight.airline).toBeTruthy();
        expect(option.flight.actualDeparture).toBeTruthy();
        expect(option.flight.origin).toBe("HKG");
        expect(option.offeredCabin).toBeTruthy();
        expect(Array.isArray(option.reasoning)).toBe(true);
        expect(option.reasoning.length).toBeGreaterThan(0);
        expect(typeof option.score).toBe("number");
        expect(typeof option.delayMinutes).toBe("number");
        expect(typeof option.seatMatch).toBe("boolean");
        expect(typeof option.downgradeProtected).toBe("boolean");
      }
    }
  });

  it("covers overnight, UM/WCH/SSR, party, downgrade, CX and partner metal, and ties", () => {
    const cells = freshMatrix();
    const options = cells.flatMap((cell) => generateOptions(cell.connection, cell.pool));
    const text = options.map((option) => option.reasoning.join(" ")).join("\n");
    expect(text).toMatch(/Overnight option/);
    expect(text).toMatch(/Unaccompanied minor/);
    expect(text).toMatch(/Wheelchair assistance/);
    expect(text).toMatch(/Keep party COLE together|Unsplittable party/);
    expect(text).toMatch(/Downgrade protection|Hold .+ instead/);
    expect(options.some((option) => option.flight.airline === "CX")).toBe(true);
    expect(options.some((option) => option.flight.airline !== "CX")).toBe(true);
    expect(options.some((option) => option.downgradeProtected)).toBe(true);
    expect(cells.some((cell) => cell.connection.passenger.ssr?.includes("UMNR"))).toBe(true);
    expect(cells.some((cell) => cell.connection.passenger.ssr?.includes("WCHR"))).toBe(true);
    const um = cells.find((cell) => cell.connection.passenger.um === true)!;
    const umText = generateOptions(um.connection, um.pool)
      .map((option) => option.reasoning.join(" "))
      .join(" ");
    expect(umText).not.toMatch(/Overnight option/);
    expect(generateOptions(um.connection, um.pool).every((option) => option.flight.airline === "CX")).toBe(true);
  });
});
