import type { Passenger, RecoveryOption, Flight } from "engine";
import type { Locale } from "@/lib/adapter/types";

export type DraftInput = {
  passenger: Passenger;
  inbound: Flight;
  outbound: Flight;
  option: RecoveryOption;
  locale: Locale;
};

function clock(iso: string): string {
  return iso.slice(11, 16);
}

export async function draftNotification(input: DraftInput): Promise<{ text: string }> {
  await new Promise((resolve) => setTimeout(resolve, 240));
  const dest = input.option.flight.destination;
  const flight = input.option.flight.flightNumber;
  const dep = clock(input.option.flight.scheduledDeparture);
  const gate = input.option.flight.gate;
  const name = input.passenger.name;
  if (input.locale === "zh-Hant") {
    return {
      text: `${name} 您好：原定 ${input.outbound.flightNumber} 接駁受阻。我們已為您預留改乘 ${flight} 前往 ${dest}，預計 ${dep} 由 ${gate} 閘口起飛。請依指示前往轉機櫃檯。`,
    };
  }
  if (input.locale === "ja") {
    return {
      text: `${name} 様：接続便 ${input.outbound.flightNumber} に影響が出ています。代替便 ${flight}（${dest} 行き、${dep} 発、ゲート ${gate}）をご用意しました。乗継カウンターへお越しください。`,
    };
  }
  return {
    text: `Dear ${name}, your connection ${input.outbound.flightNumber} is at risk. We have held ${flight} to ${dest}, departing ${dep} from gate ${gate}. Please proceed to the transfer desk with this message.`,
  };
}
