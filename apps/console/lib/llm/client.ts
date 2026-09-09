import { draftNotification, type DraftInput, type DraftResult } from "./draft";

export async function fetchDraft(input: DraftInput): Promise<DraftResult> {
  try {
    const res = await fetch("/api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) return (await res.json()) as DraftResult;
  } catch {
    // Fall through to the local mock so a down API never blocks the desk.
  }
  return draftNotification(input);
}
