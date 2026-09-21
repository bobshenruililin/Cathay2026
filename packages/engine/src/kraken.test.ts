import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const workspace = join(dirname(fileURLToPath(import.meta.url)), "../../..");

describe("Kraken claims", () => {
  it("keeps claim leases as a markdown board, not a Kraken framework", () => {
    const readme = readFileSync(join(workspace, "docs/claims/README.md"), "utf8");
    expect(existsSync(join(workspace, "docs/claims"))).toBe(true);
    expect(readme).toMatch(/not a framework/);
    const agents = readFileSync(join(workspace, "AGENTS.md"), "utf8");
    expect(agents).toMatch(/docs\/claims\//);
    const rootPkg = readFileSync(join(workspace, "package.json"), "utf8");
    expect(rootPkg).not.toMatch(/kraken/i);
    const enginePkg = readFileSync(join(workspace, "packages/engine/package.json"), "utf8");
    expect(enginePkg).not.toMatch(/kraken/i);
  });
});
