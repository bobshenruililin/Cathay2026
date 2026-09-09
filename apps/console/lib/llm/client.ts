import { draftNotification, type DraftInput, type DraftResult } from "./draft";

function asDraftResult(body: DraftResult): DraftResult {
  return { text: body.text, usedFallback: Boolean(body.usedFallback) };
}

export async function fetchDraft(input: DraftInput): Promise<DraftResult> {
  try {
    const res = await fetch("/api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) return asDraftResult((await res.json()) as DraftResult);
  } catch {
    // Fall through to the local mock so a down API never blocks the desk.
  }
  const local = await draftNotification(input);
  return { ...local, usedFallback: true };
}
