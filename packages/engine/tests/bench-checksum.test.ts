import { describe, expect, it } from "vitest";
import { GOLDEN, loadWorkload } from "../bench/workload";

describe("engine bench checksums", () => {
  it("locks kernel fingerprints so a faster bench cannot drop work", () => {
    const got: Record<string, string> = {};
    for (const kernel of loadWorkload()) {
      got[kernel.name] = kernel.run();
    }
    expect(got).toEqual(GOLDEN);
  });
});
