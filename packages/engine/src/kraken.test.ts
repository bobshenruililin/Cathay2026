import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const workspace = join(dirname(fileURLToPath(import.meta.url)), "../../..");

describe("Kraken claims", () => {
  it("does not add a claims-lease framework", () => {
    expect(existsSync(join(workspace, "docs/claims"))).toBe(false);
    const rootPkg = readFileSync(join(workspace, "package.json"), "utf8");
    expect(rootPkg).not.toMatch(/kraken/i);
  });
});
