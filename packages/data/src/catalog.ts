export const BANK_START_ISO = "2026-11-16T18:00:00+08:00";
export const BANK_END_ISO = "2026-11-17T02:00:00+08:00";

export type CityHop = {
  city: string;
  blockMinutes: number;
  longhaul: boolean;
};

export const CX_INBOUND: CityHop[] = [
  { city: "TPE", blockMinutes: 95, longhaul: false },
  { city: "KIX", blockMinutes: 210, longhaul: false },
  { city: "NRT", blockMinutes: 250, longhaul: false },
  { city: "HND", blockMinutes: 250, longhaul: false },
  { city: "ICN", blockMinutes: 210, longhaul: false },
  { city: "BKK", blockMinutes: 170, longhaul: false },
  { city: "SIN", blockMinutes: 220, longhaul: false },
  { city: "MNL", blockMinutes: 130, longhaul: false },
  { city: "SGN", blockMinutes: 155, longhaul: false },
  { city: "HAN", blockMinutes: 145, longhaul: false },
  { city: "PVG", blockMinutes: 150, longhaul: false },
  { city: "PEK", blockMinutes: 200, longhaul: false },
  { city: "KUL", blockMinutes: 220, longhaul: false },
  { city: "CGK", blockMinutes: 275, longhaul: false },
  { city: "SYD", blockMinutes: 540, longhaul: true },
  { city: "MEL", blockMinutes: 550, longhaul: true },
  { city: "DEL", blockMinutes: 360, longhaul: true },
  { city: "BOM", blockMinutes: 350, longhaul: true },
  { city: "SFO", blockMinutes: 720, longhaul: true },
  { city: "LAX", blockMinutes: 780, longhaul: true },
];

export const CX_OUTBOUND: CityHop[] = [
  { city: "LHR", blockMinutes: 780, longhaul: true },
  { city: "CDG", blockMinutes: 760, longhaul: true },
  { city: "FRA", blockMinutes: 740, longhaul: true },
  { city: "AMS", blockMinutes: 730, longhaul: true },
  { city: "JFK", blockMinutes: 960, longhaul: true },
  { city: "BOS", blockMinutes: 950, longhaul: true },
  { city: "YVR", blockMinutes: 700, longhaul: true },
  { city: "SYD", blockMinutes: 540, longhaul: true },
  { city: "MEL", blockMinutes: 550, longhaul: true },
  { city: "AKL", blockMinutes: 630, longhaul: true },
  { city: "TPE", blockMinutes: 95, longhaul: false },
  { city: "KIX", blockMinutes: 210, longhaul: false },
  { city: "NRT", blockMinutes: 250, longhaul: false },
  { city: "ICN", blockMinutes: 210, longhaul: false },
  { city: "BKK", blockMinutes: 170, longhaul: false },
  { city: "SIN", blockMinutes: 220, longhaul: false },
  { city: "MNL", blockMinutes: 130, longhaul: false },
  { city: "SGN", blockMinutes: 155, longhaul: false },
  { city: "PVG", blockMinutes: 150, longhaul: false },
  { city: "DXB", blockMinutes: 480, longhaul: true },
];

export const UO_CITIES: CityHop[] = [
  { city: "TPE", blockMinutes: 95, longhaul: false },
  { city: "KIX", blockMinutes: 210, longhaul: false },
  { city: "NRT", blockMinutes: 250, longhaul: false },
  { city: "ICN", blockMinutes: 210, longhaul: false },
  { city: "FUK", blockMinutes: 200, longhaul: false },
  { city: "OKA", blockMinutes: 165, longhaul: false },
  { city: "BKK", blockMinutes: 170, longhaul: false },
  { city: "DMK", blockMinutes: 170, longhaul: false },
  { city: "DAD", blockMinutes: 140, longhaul: false },
  { city: "CNX", blockMinutes: 185, longhaul: false },
];

export type PartnerHop = CityHop & { airline: string; flightNumber: string };

export const ONEWORLD_DEPARTURES: PartnerHop[] = [
  { airline: "BA", flightNumber: "BA32", city: "LHR", blockMinutes: 780, longhaul: true },
  { airline: "BA", flightNumber: "BA28", city: "LHR", blockMinutes: 780, longhaul: true },
  { airline: "QR", flightNumber: "QR817", city: "DOH", blockMinutes: 480, longhaul: true },
  { airline: "QR", flightNumber: "QR815", city: "DOH", blockMinutes: 480, longhaul: true },
  { airline: "JL", flightNumber: "JL26", city: "NRT", blockMinutes: 250, longhaul: false },
  { airline: "JL", flightNumber: "JL28", city: "HND", blockMinutes: 250, longhaul: false },
  { airline: "QF", flightNumber: "QF128", city: "SYD", blockMinutes: 540, longhaul: true },
  { airline: "QF", flightNumber: "QF30", city: "MEL", blockMinutes: 550, longhaul: true },
  { airline: "MH", flightNumber: "MH73", city: "KUL", blockMinutes: 220, longhaul: false },
  { airline: "MH", flightNumber: "MH79", city: "KUL", blockMinutes: 220, longhaul: false },
  { airline: "AY", flightNumber: "AY100", city: "HEL", blockMinutes: 700, longhaul: true },
  { airline: "AA", flightNumber: "AA204", city: "DFW", blockMinutes: 900, longhaul: true },
  { airline: "IB", flightNumber: "IB6822", city: "MAD", blockMinutes: 800, longhaul: true },
  { airline: "UL", flightNumber: "UL656", city: "CMB", blockMinutes: 330, longhaul: false },
  { airline: "RJ", flightNumber: "RJ183", city: "AMM", blockMinutes: 600, longhaul: true },
  { airline: "AT", flightNumber: "AT266", city: "CMN", blockMinutes: 820, longhaul: true },
  { airline: "FJ", flightNumber: "FJ392", city: "NAN", blockMinutes: 600, longhaul: true },
  { airline: "AS", flightNumber: "AS850", city: "SEA", blockMinutes: 720, longhaul: true },
  { airline: "WY", flightNumber: "WY842", city: "MCT", blockMinutes: 480, longhaul: true },
  { airline: "AY", flightNumber: "AY102", city: "HEL", blockMinutes: 700, longhaul: true },
];
