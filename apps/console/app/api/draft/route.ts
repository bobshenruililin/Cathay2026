import { draftNotification, type DraftInput } from "@/lib/llm/draft";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as DraftInput;
    const result = await draftNotification(input);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Draft failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
