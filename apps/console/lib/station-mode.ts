/** Live path is packages/sim. Mock adapter is an explicit seam. */
export function isSimMode(adapter = process.env.NEXT_PUBLIC_CONSOLE_ADAPTER): boolean {
  return adapter !== "mock";
}

export type StationModeBadge = {
  testId: "sim-badge" | "offline-draft-badge";
  label: string;
};

/** SIM is always on for the live adapter. Offline draft shows when the API missed or the guard fell back. */
export function stationModeBadges(simMode: boolean, offlineDraft: boolean): StationModeBadge[] {
  const badges: StationModeBadge[] = [];
  if (simMode) badges.push({ testId: "sim-badge", label: "SIM" });
  if (offlineDraft) badges.push({ testId: "offline-draft-badge", label: "Offline draft" });
  return badges;
}
