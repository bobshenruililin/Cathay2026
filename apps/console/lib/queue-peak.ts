/** Evening bank starts hot; typhoon/CX254 delays are the flood. */
export function queuePeakLabel(itemCount: number, delayedFlights: number): string | null {
  if (itemCount <= 0 || delayedFlights <= 0) return null;
  return `Peak — ${itemCount} at-risk · ${delayedFlights} delayed`;
}
