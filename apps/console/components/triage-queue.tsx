"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/async-state";
import { StatusBadge, TierBadge } from "@/components/status-badge";
import { formatFlight } from "@/lib/format";
import type { QueueItem } from "@/lib/adapter/types";
import { cn } from "@/lib/utils";

export function TriageQueue({
  items,
  quietCount,
  selectedPnr,
  status,
  error,
  onRetry,
  onSelect,
}: {
  items: QueueItem[];
  quietCount: number;
  selectedPnr: string | null;
  status: "loading" | "ready" | "error";
  error: string | null;
  onRetry: () => void;
  onSelect: (pnr: string) => void;
}) {
  return (
    <section className="flex min-h-0 flex-col border-r bg-card" data-testid="triage-queue">
      <div className="border-b px-4 py-3">
        <h2 className="font-heading text-sm font-medium">Triage queue</h2>
        <p className="text-xs text-muted-foreground">Missed first, then tight · Diamond first</p>
        <p className="text-xs text-muted-foreground" data-testid="quiet-count">
          {quietCount} connection{quietCount === 1 ? "" : "s"} OK — silent
        </p>
      </div>
      {status === "loading" ? <LoadingBlock label="Loading at-risk connections…" /> : null}
      {status === "error" ? <ErrorBlock message={error ?? "Queue failed"} onRetry={onRetry} /> : null}
      {status === "ready" && items.length === 0 ? (
        <EmptyBlock title="No at-risk connections" detail="The desk is clear for this clock." />
      ) : null}
      {status === "ready" && items.length > 0 ? (
        <ScrollArea className="min-h-0 flex-1">
          <ul className="flex flex-col">
            {items.map((item) => {
              const active = item.passenger.pnr === selectedPnr;
              return (
                <li key={item.passenger.pnr}>
                  <button
                    type="button"
                    data-testid="queue-item"
                    data-pnr={item.passenger.pnr}
                    data-has-options={item.result.options.length > 0 ? "true" : "false"}
                    onClick={() => onSelect(item.passenger.pnr)}
                    className={cn(
                      "flex w-full flex-col gap-1 border-b px-4 py-3 text-left hover:bg-muted/70",
                      active && "bg-muted",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{item.passenger.name}</span>
                      <StatusBadge status={item.result.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <TierBadge tier={item.passenger.tier} />
                      <span className="text-xs text-muted-foreground">{item.passenger.pnr}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatFlight(item.inbound.flightNumber, item.inbound.origin, "HKG")} ·{" "}
                      {formatFlight(item.outbound.flightNumber, "HKG", item.outbound.destination)}
                    </p>
                    <p className="text-xs">
                      Slack {item.result.slackMinutes} min · need {item.result.requiredMinutes} min
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      ) : null}
    </section>
  );
}
