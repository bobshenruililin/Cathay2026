import type { DraftInput, DraftResult } from "./draft";

export async function fetchDraft(input: DraftInput): Promise<DraftResult> {
  const res = await fetch("/api/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Draft request failed (${res.status})`);
  }
  return (await res.json()) as DraftResult;
}
