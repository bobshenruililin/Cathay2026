"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ActionDrawer } from "@/components/action-drawer";
import { ConnectionPanel } from "@/components/connection-panel";
import { StationHeader } from "@/components/station-header";
import { TriageQueue } from "@/components/triage-queue";
import { getConsoleAdapter } from "@/lib/adapter";
import { fetchDraft } from "@/lib/llm/client";
import { applyFlightNumberGuard } from "@/lib/llm/guard";
import { isSimMode } from "@/lib/station-mode";
import type { ConsoleSnapshot, Locale, QueueItem } from "@/lib/adapter/types";
import type { RecoveryOption } from "engine";

type LoadStatus = "loading" | "ready" | "error";
type DraftStatus = "idle" | "loading" | "ready" | "error";

export function ConsoleShell() {
  const adapter = useMemo(() => getConsoleAdapter(), []);
  const [snapshot, setSnapshot] = useState<ConsoleSnapshot | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [selectedPnr, setSelectedPnr] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<RecoveryOption | null>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const [draft, setDraft] = useState("");
  const [draftStatus, setDraftStatus] = useState<DraftStatus>("idle");
  const [draftError, setDraftError] = useState<string | null>(null);
  const [offlineDraft, setOfflineDraft] = useState(false);
  const [sending, setSending] = useState(false);
  const [delayFlight, setDelayFlight] = useState("CX254");
  const [delayMinutes, setDelayMinutes] = useState("45");

  const selected: QueueItem | null =
    snapshot?.queue.find((item) => item.passenger.pnr === selectedPnr) ?? null;

  const applySnapshot = useCallback((next: ConsoleSnapshot, keepPnr: string | null) => {
    setSnapshot(next);
    setStatus("ready");
    setError(null);
    const still = next.queue.some((item) => item.passenger.pnr === keepPnr);
    setSelectedPnr(still ? keepPnr : (next.queue[0]?.passenger.pnr ?? null));
    if (!still) {
      setSelectedOption(null);
      setDraft("");
      setDraftStatus("idle");
      setOfflineDraft(false);
    }
    if (next.flights.every((flight) => flight.flightNumber !== delayFlight)) {
      setDelayFlight(next.flights[0]?.flightNumber ?? "");
    }
  }, [delayFlight]);

  const reload = useCallback(async () => {
    setStatus("loading");
    try {
      applySnapshot(await adapter.load(), selectedPnr);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Load failed");
    }
  }, [adapter, applySnapshot, selectedPnr]);

  useEffect(() => {
    void reload();
    // First paint only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(action: () => Promise<ConsoleSnapshot>) {
    setBusy(true);
    try {
      applySnapshot(await action(), selectedPnr);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!selected || !selectedOption) return;
    let cancelled = false;
    setDraftStatus("loading");
    setDraftError(null);
    setOfflineDraft(false);
    void fetchDraft({
      passenger: selected.passenger,
      inbound: selected.inbound,
      outbound: selected.outbound,
      option: selectedOption,
      locale,
    })
      .then((result) => {
        if (cancelled) return;
        setDraft(result.text);
        setDraftStatus("ready");
        setOfflineDraft(result.usedFallback);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setDraftStatus("error");
        setDraftError(err instanceof Error ? err.message : "Draft failed");
        setOfflineDraft(true);
      });
    return () => {
      cancelled = true;
    };
  }, [selected, selectedOption, locale]);

  async function onApprove() {
    if (!selected || !selectedOption) return;
    setSending(true);
    try {
      const guarded = applyFlightNumberGuard(draft, {
        inbound: selected.inbound,
        outbound: selected.outbound,
        option: selectedOption,
      });
      applySnapshot(
        await adapter.approveRebooking(selected.passenger.pnr, selectedOption, guarded.text),
        selected.passenger.pnr,
      );
      setSelectedOption(null);
      setDraft("");
      setDraftStatus("idle");
      setOfflineDraft(false);
    } catch (err) {
      setDraftStatus("error");
      setDraftError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-dvh min-h-dvh min-w-[1024px] flex-col overflow-hidden bg-muted/30">
      <StationHeader
        snapshot={snapshot}
        busy={busy || status === "loading"}
        simMode={isSimMode()}
        offlineDraft={offlineDraft}
        delayFlight={delayFlight}
        delayMinutes={delayMinutes}
        onDelayFlight={setDelayFlight}
        onDelayMinutes={setDelayMinutes}
        onAdvance={(minutes) => void run(() => adapter.advanceClock(minutes))}
        onInject={() =>
          void run(() => adapter.injectDelay(delayFlight, Number(delayMinutes) || 0))
        }
        onTyphoon={() => void run(() => adapter.simulateTyphoonDelay())}
        onCx254={() => void run(() => adapter.lateInboundCx254())}
      />
      <main className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)_380px]">
        <TriageQueue
          items={snapshot?.queue ?? []}
          quietCount={snapshot?.disruption.quietCount ?? 0}
          selectedPnr={selectedPnr}
          status={status}
          error={error}
          onRetry={() => void reload()}
          onSelect={(pnr) => {
            setSelectedPnr(pnr);
            setSelectedOption(null);
            setDraft("");
            setDraftStatus("idle");
            setOfflineDraft(false);
          }}
        />
        <ConnectionPanel
          item={selected}
          selectedFlight={selectedOption?.flight.flightNumber ?? null}
          onSelectOption={setSelectedOption}
        />
        <ActionDrawer
          item={selected}
          option={selectedOption}
          locale={locale}
          draft={draft}
          draftStatus={draftStatus}
          draftError={draftError}
          sending={sending}
          onLocale={setLocale}
          onDraftChange={setDraft}
          onApprove={() => void onApprove()}
        />
      </main>
    </div>
  );
}
