import { createSimAdapter } from "./sim-adapter";
import { createMockAdapter } from "./mock-adapter";
import type { ConsoleAdapter } from "./types";

export type { ConsoleAdapter, ConsoleSnapshot, QueueItem, Locale } from "./types";
export { createSimAdapter, DEMO_SEED } from "./sim-adapter";
export { createMockAdapter } from "./mock-adapter";

let adapter: ConsoleAdapter | undefined;

/**
 * Live path is packages/sim + packages/engine.
 * Mock adapter remains a seam: NEXT_PUBLIC_CONSOLE_ADAPTER=mock
 */
export function getConsoleAdapter(): ConsoleAdapter {
  if (!adapter) {
    adapter =
      process.env.NEXT_PUBLIC_CONSOLE_ADAPTER === "mock" ? createMockAdapter() : createSimAdapter();
  }
  return adapter;
}
