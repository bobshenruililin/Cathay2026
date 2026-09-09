export function minutesBetween(fromIso: string, toIso: string): number {
  return (Date.parse(toIso) - Date.parse(fromIso)) / 60_000;
}

export function addMinutesIso(iso: string, minutes: number): string {
  return formatHkgIso(Date.parse(iso) + minutes * 60_000);
}

export function hkgCalendarDay(iso: string): string {
  return formatHkgIso(Date.parse(iso)).slice(0, 10);
}

export function formatHkgIso(epochMs: number): string {
  const shifted = epochMs + 8 * 60 * 60 * 1000;
  const d = new Date(shifted);
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const da = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}-${mo}-${da}T${h}:${mi}:${s}+08:00`;
}
