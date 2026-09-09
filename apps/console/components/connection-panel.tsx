"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { EmptyBlock } from "@/components/async-state";
import { StatusBadge, TierBadge } from "@/components/status-badge";
import { formatFlight, formatHkt } from "@/lib/format";
import type { QueueItem } from "@/lib/adapter/types";
import type { RecoveryOption } from "engine";
import { cn } from "@/lib/utils";

export function ConnectionPanel({
  item,
  selectedFlight,
  onSelectOption,
}: {
  item: QueueItem | null;
  selectedFlight: string | null;
  onSelectOption: (option: RecoveryOption) => void;
}) {
  if (!item) {
    return (
      <EmptyBlock
        title="Select a passenger"
        detail="Choose a high-priority connection from the triage queue."
      />
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-lg font-medium">{item.passenger.name}</h2>
          <TierBadge tier={item.passenger.tier} />
          <StatusBadge status={item.result.status} />
          <span className="text-sm text-muted-foreground">
            {item.passenger.cabin} · {item.passenger.pnr}
          </span>
        </div>
        <div className="grid gap-3 min-[900px]:grid-cols-2">
          <FlightCard title="Inbound" flight={item.inbound} />
          <FlightCard title="Outbound" flight={item.outbound} />
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {item.result.reasoning.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <Separator />
        <h3 className="font-heading text-sm font-medium">Top recovery options</h3>
        {item.result.options.length === 0 ? (
          <EmptyBlock title="No computed options" detail="The engine returned an empty set for this itinerary." />
        ) : (
          <div className="grid gap-3">
            {item.result.options.slice(0, 3).map((option) => {
              const active = option.flight.flightNumber === selectedFlight;
              return (
                <button
                  key={option.flight.flightNumber}
                  type="button"
                  onClick={() => onSelectOption(option)}
                  className={cn("text-left", active && "ring-2 ring-ring rounded-xl")}
                >
                  <Card size="sm">
                    <CardHeader>
                      <CardTitle>
                        {formatFlight(
                          option.flight.flightNumber,
                          option.flight.origin,
                          option.flight.destination,
                        )}{" "}
                        · score {option.score.toFixed(1)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 text-xs text-muted-foreground">
                        {formatHkt(option.flight.scheduledDeparture)} · gate {option.flight.gate}
                      </p>
                      <ul className="list-disc space-y-1 pl-4 text-sm">
                        {option.reasoning.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

function FlightCard({
  title,
  flight,
}: {
  title: string;
  flight: QueueItem["inbound"];
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          {title}: {formatFlight(flight.flightNumber, flight.origin, flight.destination)}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>Sched {formatHkt(flight.scheduledDeparture)} → {formatHkt(flight.scheduledArrival)}</p>
        <p>Actual {formatHkt(flight.actualDeparture)} → {formatHkt(flight.actualArrival)}</p>
        <p>
          Delay {flight.delayMinutes} min · {flight.status} · gate {flight.gate}
        </p>
      </CardContent>
    </Card>
  );
}
