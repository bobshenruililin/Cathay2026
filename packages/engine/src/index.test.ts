import { describe, expect, it } from "vitest";
import {
  GATE_WALK_BUFFER_MINUTES,
  generateOptions,
  scoreOption,
  triageConnection,
} from "./index";
import { addMinutesIso } from "./iso";
import { INBOUND, makeConnection, makeFlight } from "./fixtures";

describe("engine public api", () => {
  it("re-exports triage, options, and MCT constants", () => {
    expect(GATE_WALK_BUFFER_MINUTES).toBe(10);
    expect(typeof scoreOption).toBe("function");
    const outbound = makeFlight(
      "CX250",
      "CX",
      "HKG",
      "LHR",
      addMinutesIso(INBOUND.actualArrival, 40),
      addMinutesIso(INBOUND.actualArrival, 820),
    );
    const result = triageConnection(makeConnection(INBOUND, outbound), []);
    expect(result.status).toBe("missed");
    expect(generateOptions(makeConnection(INBOUND, outbound), []).length).toBe(0);
  });
});
