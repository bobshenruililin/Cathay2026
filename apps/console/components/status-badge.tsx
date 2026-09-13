import { Badge } from "@/components/ui/badge";
import type { ConnectionStatus, LoyaltyTier } from "engine";

const STATUS_CLASS: Record<ConnectionStatus, string> = {
  missed: "border-transparent bg-red-600 text-white",
  tight: "border-transparent bg-amber-500 text-black",
  ok: "border-transparent bg-emerald-600 text-white",
  invalid: "border-border bg-muted text-muted-foreground",
};

const TIER_CLASS: Record<LoyaltyTier, string> = {
  Diamond: "border-transparent bg-violet-700 text-white",
  Gold: "border-transparent bg-yellow-500 text-black",
  Silver: "border-transparent bg-slate-400 text-black",
  Green: "border-transparent bg-emerald-700 text-white",
};

export function StatusBadge({ status }: { status: ConnectionStatus }) {
  return (
    <Badge className={STATUS_CLASS[status]} variant="outline">
      {status}
    </Badge>
  );
}

export function TierBadge({ tier }: { tier: LoyaltyTier }) {
  return (
    <Badge className={TIER_CLASS[tier]} variant="outline">
      {tier}
    </Badge>
  );
}

function handlingBadgeClass(flag: string): string {
  if (flag === "UM") {
    return "border-amber-700 bg-amber-100 text-amber-950 text-xs font-semibold";
  }
  if (flag === "WCH") {
    return "border-sky-700 bg-sky-100 text-sky-950 text-xs font-semibold";
  }
  return "border-violet-700 bg-violet-100 text-violet-950 text-xs font-semibold";
}

export function HandlingBadges({ flags }: { flags: string[] }) {
  if (flags.length === 0) return null;
  return (
    <span className="flex flex-wrap gap-1" data-testid="handling-flags">
      {flags.map((flag) => (
        <Badge key={flag} variant="outline" className={handlingBadgeClass(flag)}>
          {flag}
        </Badge>
      ))}
    </span>
  );
}
