import { describe, expect, it } from "vitest";
import {
  HKG_MCT_MINUTES,
  UM_ESCORT_BUFFER_MINUTES,
  WHEELCHAIR_TRANSIT_BUFFER_MINUTES,
  connectionRequiredMinutes,
  connectionStatus,
  generateOptions,
  partySeating,
  requiredMinutes,
  triageConnection,
} from "../src/index";
import {
  BIZ_GONE,
  EMPTY,
  FOUR_ECONOMY,
  FULL,
  ONLY_ECONOMY,
  TWO_BIZ,
  link,
  out,
  pax,
} from "./scenario-fixtures";

const missed = () => out("CX250", "CX", 40, FULL);

describe("20 real-world edge cases", () => {
  it("1 UM: 70 min slack is missed because escort buffer is additive to MCT", () => {
    const result = triageConnection(link(pax({ um: true }), out("CX250", "CX", 70, FULL)));
    expect(HKG_MCT_MINUTES.CX_CX + 10).toBe(60);
    expect(result.requiredMinutes).toBe(60 + UM_ESCORT_BUFFER_MINUTES);
    expect(result.status).toBe("missed");
    expect(result.reasoning.join(" ")).toMatch(/Unaccompanied minor/);
  });

  it("2 UM: 80 min slack is tight, not healthy", () => {
    const result = triageConnection(link(pax({ um: true }), out("CX250", "CX", 80, FULL)));
    expect(result.status).toBe("tight");
    expect(result.feasible).toBe(true);
  });

  it("3 UM: partner metal is not offered even when it scores well", () => {
    const options = generateOptions(link(pax({ um: true }), missed()), [
      out("BA32", "BA", 120, FULL),
      out("CX252", "CX", 120, FULL),
    ]);
    expect(options.map((o) => o.flight.flightNumber)).toEqual(["CX252"]);
    expect(options[0]?.reasoning.join(" ")).toMatch(/CX metal/);
  });

  it("4 UM: healthy adult slack of 70 min stays tight without escort buffer", () => {
    const adult = triageConnection(link(pax({ um: false }), out("CX250", "CX", 70, FULL)));
    expect(adult.requiredMinutes).toBe(60);
    expect(adult.status).toBe("tight");
  });

  it("5 UM+wheelchair: escort and wheelchair buffers stack on the MCT table", () => {
    const passenger = pax({ um: true, wheelchair: true });
    const result = triageConnection(link(passenger, out("CX250", "CX", 90, FULL)), [
      out("CX252", "CX", 140, FULL),
    ]);
    expect(result.requiredMinutes).toBe(60 + UM_ESCORT_BUFFER_MINUTES + WHEELCHAIR_TRANSIT_BUFFER_MINUTES);
    expect(result.status).toBe("missed");
    expect(result.options[0]?.reasoning.join(" ")).toMatch(/Unaccompanied minor/);
    expect(result.options[0]?.reasoning.join(" ")).toMatch(/Wheelchair assistance/);
  });

  it("6 wheelchair: 70 min slack is missed (60 MCT+walk plus 15)", () => {
    const result = triageConnection(link(pax({ wheelchair: true }), out("CX250", "CX", 70, FULL)));
    expect(result.requiredMinutes).toBe(75);
    expect(result.status).toBe("missed");
  });

  it("7 wheelchair: 75 min slack is feasible and tight", () => {
    const connection = link(pax({ wheelchair: true }), out("CX250", "CX", 75, FULL));
    expect(connectionRequiredMinutes(connection)).toBe(75);
    expect(connectionStatus(connection)).toBe("tight");
  });

  it("8 wheelchair: alternative below extra transit is not viable", () => {
    const options = generateOptions(link(pax({ wheelchair: true }), missed()), [
      out("CX252", "CX", 70, FULL),
      out("CX254", "CX", 120, FULL),
    ]);
    expect(options.map((o) => o.flight.flightNumber)).toEqual(["CX254"]);
  });

  it("9 wheelchair: reasoning documents additive buffer; MCT table unchanged", () => {
    const result = triageConnection(link(pax({ wheelchair: true }), missed()), [out("CX252", "CX", 120, FULL)]);
    expect(HKG_MCT_MINUTES.CX_CX).toBe(50);
    expect(requiredMinutes("CX", "CX")).toBe(60);
    expect(result.reasoning.join(" ")).toMatch(/Wheelchair assistance adds 15/);
    expect(result.options[0]?.reasoning.join(" ")).toMatch(/wheelchair or escort time/);
  });

  it("10 wheelchair: adult without flag still uses MCT+walk only", () => {
    expect(triageConnection(link(pax({}), out("CX250", "CX", 60, FULL))).requiredMinutes).toBe(60);
  });

  it("11 party of 4: cannot split 2+2 seats across cabins on one flight", () => {
    const options = generateOptions(link(pax({ partySize: 4 }), missed()), [out("CX252", "CX", 120, TWO_BIZ)]);
    expect(options).toEqual([]);
    expect(partySeating(out("CX252", "CX", 120, TWO_BIZ), pax({ partySize: 4 }))).toBeUndefined();
  });

  it("12 party of 4: two flights with 2 seats each are not combined", () => {
    const options = generateOptions(link(pax({ partySize: 4 }), missed()), [
      out("CX252", "CX", 120, TWO_BIZ),
      out("CX254", "CX", 180, TWO_BIZ),
    ]);
    expect(options).toEqual([]);
  });

  it("13 party of 4: one flight with 4 Economy seats seats the whole PNR", () => {
    const options = generateOptions(link(pax({ partySize: 4 }), missed()), [
      out("CX252", "CX", 120, FOUR_ECONOMY),
    ]);
    expect(options).toHaveLength(1);
    expect(options[0]?.offeredCabin).toBe("Economy");
    expect(options[0]?.reasoning.join(" ")).toMatch(/Party of 4 stays together|Hold Economy instead/);
  });

  it("14 party of 1 can use a 2-seat flight that a party of 4 cannot", () => {
    const pool = [out("CX252", "CX", 120, TWO_BIZ)];
    expect(generateOptions(link(pax({ partySize: 1 }), missed()), pool)).toHaveLength(1);
    expect(generateOptions(link(pax({ partySize: 4 }), missed()), pool)).toEqual([]);
  });

  it("15 party of 4: triage reasoning forbids splitting across flights", () => {
    const result = triageConnection(link(pax({ partySize: 4 }), missed()), [out("CX252", "CX", 120, FULL)]);
    expect(result.reasoning.join(" ")).toMatch(/Party of 4 on one PNR cannot be split/);
    expect(result.options[0]?.reasoning.join(" ")).toMatch(/Party of 4 stays together/);
  });

  it("16 Business exhausted: downgrade protection holds Premium Economy", () => {
    const options = generateOptions(link(pax({ cabin: "Business" }), missed()), [
      out("CX252", "CX", 120, BIZ_GONE),
    ]);
    expect(options[0]?.seatMatch).toBe(false);
    expect(options[0]?.downgradeProtected).toBe(true);
    expect(options[0]?.offeredCabin).toBe("Premium Economy");
    expect(options[0]?.reasoning.join(" ")).toMatch(/Hold Premium Economy instead/);
  });

  it("17 Business and Premium Economy exhausted: protection holds Economy", () => {
    const options = generateOptions(link(pax({ cabin: "Business" }), missed()), [
      out("CX252", "CX", 120, ONLY_ECONOMY),
    ]);
    expect(options[0]?.offeredCabin).toBe("Economy");
    expect(options[0]?.downgradeProtected).toBe(true);
  });

  it("18 complete cabin exhaustion yields no option", () => {
    expect(generateOptions(link(pax({}), missed()), [out("CX252", "CX", 120, EMPTY)])).toEqual([]);
  });

  it("19 First exhausted downgrades through Business with human-readable reasoning", () => {
    const options = generateOptions(link(pax({ cabin: "First" }), missed()), [
      out("CX252", "CX", 120, seatsBiz()),
    ]);
    expect(options[0]?.offeredCabin).toBe("Business");
    expect(options[0]?.reasoning.join(" ")).toMatch(/First is full/);
    expect(options[0]?.reasoning.join(" ")).toMatch(/Hold Business instead/);
  });

  it("20 mixed: UM party of 4 with Business gone stays on one CX flight", () => {
    const options = generateOptions(link(pax({ um: true, wheelchair: true, partySize: 4 }), missed()), [
      out("BA32", "BA", 140, FOUR_ECONOMY),
      out("CX252", "CX", 140, FOUR_ECONOMY),
      out("CX254", "CX", 200, EMPTY),
    ]);
    expect(options.map((o) => o.flight.flightNumber)).toEqual(["CX252"]);
    expect(options[0]?.downgradeProtected).toBe(true);
    expect(options[0]?.reasoning.join(" ")).toMatch(/Unaccompanied minor/);
    expect(options[0]?.reasoning.join(" ")).toMatch(/Wheelchair assistance/);
    expect(options[0]?.reasoning.join(" ")).toMatch(/nobody is split off CX252/);
  });
});

function seatsBiz() {
  return { First: 0, Business: 8, "Premium Economy": 10, Economy: 40 };
}
