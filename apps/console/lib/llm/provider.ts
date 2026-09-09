export const DRAFT_SYSTEM_PROMPT =
  "Draft a concise, empathetic flight disruption SMS/push message (max 50 words) based strictly on the provided recovery flight details.";

type ChatOk = { text: string } | null;

async function readJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function openaiChat(system: string, user: string): Promise<ChatOk> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 120,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) return null;
  const json = await readJson(res);
  const choices = json?.choices as Array<{ message?: { content?: string } }> | undefined;
  const text = choices?.[0]?.message?.content?.trim();
  return text ? { text } : null;
}

async function anthropicChat(system: string, user: string): Promise<ChatOk> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-latest",
      max_tokens: 120,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) return null;
  const json = await readJson(res);
  const content = json?.content as Array<{ text?: string }> | undefined;
  const text = content?.[0]?.text?.trim();
  return text ? { text } : null;
}

/** Real provider when an env key exists; otherwise null so callers use the local mock. */
export async function generateWithLlm(system: string, user: string): Promise<string | null> {
  try {
    const openai = await openaiChat(system, user);
    if (openai) return openai.text;
    const anthropic = await anthropicChat(system, user);
    if (anthropic) return anthropic.text;
  } catch {
    return null;
  }
  return null;
}
