"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/async-state";
import type { Locale } from "@/lib/adapter/types";
import type { QueueItem } from "@/lib/adapter/types";
import type { RecoveryOption } from "engine";

export function ActionDrawer({
  item,
  option,
  locale,
  draft,
  draftStatus,
  draftError,
  sending,
  onLocale,
  onDraftChange,
  onApprove,
}: {
  item: QueueItem | null;
  option: RecoveryOption | null;
  locale: Locale;
  draft: string;
  draftStatus: "idle" | "loading" | "ready" | "error";
  draftError: string | null;
  sending: boolean;
  onLocale: (locale: Locale) => void;
  onDraftChange: (value: string) => void;
  onApprove: () => void;
}) {
  return (
    <aside className="flex min-h-0 flex-col border-l bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="font-heading text-sm font-medium">Action drawer</h2>
        <p className="text-xs text-muted-foreground">AI notification is a draft until you approve</p>
      </div>
      {!item || !option ? (
        <EmptyBlock
          title="Pick a recovery option"
          detail="Select one of the top 3 engine options to draft a passenger message."
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" data-testid="draft-badge">
              Draft
            </Badge>
            <span className="text-sm text-muted-foreground">
              {option.flight.flightNumber} · {item.passenger.pnr}
            </span>
          </div>
          <div className="grid gap-1">
            <Label>Passenger locale</Label>
            <Tabs
              value={locale}
              onValueChange={(value) => {
                if (value === "en" || value === "zh-Hant" || value === "ja") onLocale(value);
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="zh-Hant">繁體中文</TabsTrigger>
                <TabsTrigger value="ja">日本語</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {draftStatus === "loading" ? <LoadingBlock label="Drafting message…" /> : null}
          {draftStatus === "error" ? (
            <ErrorBlock message={draftError ?? "Draft failed"} />
          ) : null}
          {draftStatus === "ready" || draftStatus === "idle" ? (
            <div className="grid min-h-0 flex-1 gap-1">
              <Label htmlFor="draft-message">Message preview</Label>
              <Textarea
                id="draft-message"
                data-testid="draft-message"
                className="min-h-40 flex-1"
                value={draft}
                onChange={(event) => onDraftChange(event.target.value)}
              />
            </div>
          ) : null}
          <Button
            type="button"
            size="lg"
            data-testid="approve-rebooking"
            className="h-12 w-full text-base"
            disabled={sending || draftStatus !== "ready" || draft.trim() === ""}
            onClick={onApprove}
          >
            {sending ? "Sending…" : "Approve Rebooking & Send"}
          </Button>
        </div>
      )}
    </aside>
  );
}
