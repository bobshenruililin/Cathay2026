import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["bench/run.test.ts"],
    coverage: { enabled: false },
    testTimeout: 120_000,
  },
});
