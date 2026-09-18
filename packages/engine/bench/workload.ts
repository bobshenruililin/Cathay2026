import {
  extraTransitMinutes,
  generateOptions,
  requiredMinutes,
  requiredMinutesFor,
  triageConnection,
} from "../src/index";
import { digest256, observeOption, observePassenger, observeTriage, stableStringify } from "./canonical";
import { CARRIERS, extraTransitShapes, freshMatrix } from "./matrix";

/** SHA-256 of full observed outputs. Regenerated when the matrix changes. */
export const GOLDEN = {
  extraTransit: "ac2c215cb23bca3c01bc758ea4efa2a3ae2afe139d131bd9080bbf9e0e83bb40",
  generateOptions: "2193251c50d9fb5b0dc6299bb84929edeb6da9c1b63ed0cc1aa8545290415b0a",
  requiredMinutes: "5760c2deef531cabb2cda1e55cc55d7e788ea38151642e776f95d2bfbd207635",
  triageConnection: "18c2d7f740b238de6c433407dd7cabf83255b35dfc6ec771c3b647fc0906503f",
} as const;

export type KernelName = keyof typeof GOLDEN;

export function observeRequiredTable() {
  return CARRIERS.flatMap((inbound) =>
    CARRIERS.flatMap((outbound) =>
      extraTransitShapes().map((pax) => ({
        extra: extraTransitMinutes(pax),
        inbound,
        outbound,
        pax: observePassenger(pax),
        required: requiredMinutes(inbound, outbound),
        requiredFor: requiredMinutesFor(inbound, outbound, pax),
      })),
    ),
  );
}

export function observeExtraTable() {
  return extraTransitShapes().map((pax) => ({
    extra: extraTransitMinutes(pax),
    pax: observePassenger(pax),
  }));
}

export function observeGenerateMatrix() {
  return freshMatrix().map((cell) => ({
    id: cell.id,
    options: generateOptions(cell.connection, cell.pool).map(observeOption),
  }));
}

export function observeTriageMatrix() {
  return freshMatrix().map((cell) => ({
    id: cell.id,
    triage: observeTriage(triageConnection(cell.connection, cell.pool)),
  }));
}

export function loadWorkload(): { name: KernelName; run: () => string }[] {
  return [
    { name: "requiredMinutes", run: () => digest256(stableStringify(observeRequiredTable())) },
    { name: "extraTransit", run: () => digest256(stableStringify(observeExtraTable())) },
    { name: "triageConnection", run: () => digest256(stableStringify(observeTriageMatrix())) },
    { name: "generateOptions", run: () => digest256(stableStringify(observeGenerateMatrix())) },
  ];
}
