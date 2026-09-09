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
