import { createMockAdapter } from "./mock-adapter";
import type { ConsoleAdapter } from "./types";

export type { ConsoleAdapter, ConsoleSnapshot, QueueItem, Locale } from "./types";

let adapter: ConsoleAdapter | undefined;

/** In-process mock. Swap this factory to point at a real API later. */
export function getConsoleAdapter(): ConsoleAdapter {
  if (!adapter) adapter = createMockAdapter();
  return adapter;
}
