import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const engineRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const workspace = join(engineRoot, "../..");
const trees = ["apps/console", "packages/sim", "packages/data"];
const banned = /from ["']engine\/src|packages\/engine\/src\/|from ["']fprime|nasa\/fprime/;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "coverage") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(path);
  }
  return out;
}

describe("F Prime port rule", () => {
  it("console, sim, and data import engine via the public package only", () => {
    for (const tree of trees) {
      const root = join(workspace, tree);
      for (const file of walk(root)) {
        expect(readFileSync(file, "utf8"), file).not.toMatch(banned);
      }
    }
  });
});
