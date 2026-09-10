import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const panel = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../components/connection-panel.tsx"),
  "utf8",
);

describe("connection panel handling", () => {
  it("uses engine SSR helpers, not raw um/wheelchair flags", () => {
    expect(panel).toContain("handlingFlags");
    expect(panel).toContain("HandlingBadges");
    expect(panel).not.toMatch(/passenger\.um\s*\?/);
    expect(panel).not.toMatch(/passenger\.wheelchair\s*\?/);
  });
});
