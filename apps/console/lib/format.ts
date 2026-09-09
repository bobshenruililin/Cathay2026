export function formatHkt(iso: string): string {
  const day = iso.slice(0, 10);
  const time = iso.slice(11, 16);
  return `${time} HKT · ${day}`;
}

export function formatFlight(flightNumber: string, origin: string, destination: string): string {
  return `${flightNumber} ${origin}→${destination}`;
}
