import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const app = join(dirname(fileURLToPath(import.meta.url)), "../app");

describe("passenger copilot is not the 16 Nov story", () => {
  it("does not add a chatbot or copilot route beside the desk", () => {
    expect(existsSync(join(app, "page.tsx"))).toBe(true);
    expect(existsSync(join(app, "chat"))).toBe(false);
    expect(existsSync(join(app, "copilot"))).toBe(false);
    expect(existsSync(join(app, "passenger"))).toBe(false);
  });
});
