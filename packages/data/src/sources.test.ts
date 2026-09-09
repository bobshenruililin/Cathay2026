import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

describe("OpenFlights is a citation, not a runtime", () => {
  it("packages/data has no PHP and does not import OpenFlights", () => {
    const files = walk(root);
    expect(files.some((file) => file.endsWith(".php"))).toBe(false);
    for (const file of files.filter((path) => path.endsWith(".ts") && !path.endsWith(".test.ts"))) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/openflights/i);
    }
    expect(existsSync(join(root, "openflights"))).toBe(false);
  });
});
