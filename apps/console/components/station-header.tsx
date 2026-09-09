"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatHkt } from "@/lib/format";
import type { ConsoleSnapshot } from "@/lib/adapter/types";

export function StationHeader({
  snapshot,
  busy,
  delayFlight,
  delayMinutes,
  onDelayFlight,
  onDelayMinutes,
  onAdvance,
  onInject,
}: {
  snapshot: ConsoleSnapshot | null;
  busy: boolean;
  delayFlight: string;
  delayMinutes: string;
  onDelayFlight: (value: string) => void;
  onDelayMinutes: (value: string) => void;
  onAdvance: (minutes: number) => void;
  onInject: () => void;
}) {
  const flights = snapshot?.flights ?? [];
  const disruption = snapshot?.disruption;
  const hot = (disruption?.atRiskCount ?? 0) > 0;

  return (
    <header className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b bg-card px-4 py-3 min-[1024px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.4fr)]">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          HKG station time
        </p>
        <p className="font-heading text-xl font-medium">
          {snapshot ? formatHkt(snapshot.clockIso) : "—"}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Disruption status
        </p>
        <p className={hot ? "text-lg font-medium text-destructive" : "text-lg font-medium"}>
          {disruption?.label ?? "Loading"}
        </p>
        <p className="text-xs text-muted-foreground">
          {disruption?.delayedFlights ?? 0} delayed flights
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <p className="w-full text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Quick sim controls
        </p>
        <Button type="button" variant="outline" disabled={busy} onClick={() => onAdvance(15)}>
          Advance +15m
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={() => onAdvance(30)}>
          Advance +30m
        </Button>
        <div className="flex items-end gap-2">
          <div className="grid gap-1">
            <Label htmlFor="delay-flight" className="text-xs">
              Flight
            </Label>
            <Select
              value={delayFlight}
              onValueChange={(value) => {
                if (value) onDelayFlight(value);
              }}
              disabled={busy}
            >
              <SelectTrigger id="delay-flight" className="min-w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {flights.map((flight) => (
                  <SelectItem key={flight.flightNumber} value={flight.flightNumber}>
                    {flight.flightNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="delay-min" className="text-xs">
              Delay
            </Label>
            <Input
              id="delay-min"
              className="w-20"
              inputMode="numeric"
              value={delayMinutes}
              disabled={busy}
              onChange={(event) => onDelayMinutes(event.target.value)}
            />
          </div>
          <Button type="button" disabled={busy} onClick={onInject}>
            Inject delay
          </Button>
        </div>
      </div>
    </header>
  );
}
