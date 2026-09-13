/** Freeze-cut hallway copy. Same six DEMO clicks. Not a seventh step. */

export const DESK_PAIRING = "HKG Transfer · Airport Systems · Q77";
export const DESK_HALLWAY = "The desk that doesn't split the family";
export const DESK_BESIDE = "Beside Passenger Recovery, not instead";
export const DESK_BESIDE_DETAIL = "Last 90 minutes · UM / WCH / unsplittable party";

export const CLOCK_LABEL = "HKG station time";
export const BANK_LOAD_LABEL = "Load the evening bank";
export const BANK_STATUS_LABEL = "Bank load";
export const TYPHOON_BUTTON = "Simulate Typhoon Delay";
export const CX254_BUTTON = "Late Inbound CX254";

export const QUEUE_TITLE = "At-risk connections";
export const QUEUE_SUBTITLE = "UM / WCH / party stay together · Diamond first";

export const REASONING_TITLE = "Engine reasoning (verbatim)";
export const OPTIONS_TITLE = "Top recovery options";
export const PANEL_EMPTY_TITLE = "Select a passenger";
export const PANEL_EMPTY_DETAIL =
  "Choose an unsplittable connection — UM, WCH, or party of N.";

export const DRAWER_TITLE = "Approve send";
export const DRAWER_SPLIT =
  "Engine ranked this flight. LLM drafted the SMS. Approve is the only send.";
export const DRAWER_EMPTY_TITLE = "Pick a recovery option";
export const DRAWER_EMPTY_DETAIL =
  "Select one of the top 3 engine options to draft a passenger message.";

export const PAGE_TITLE = "Reconnect — HKG Transfer Desk";
export const PAGE_DESCRIPTION = `${DESK_HALLWAY}. ${DESK_BESIDE}.`;

/** Strings painted on the live six-step glass. Characterizing test joins these. */
export const DESK_COPY_SURFACE = [
  DESK_PAIRING,
  DESK_HALLWAY,
  DESK_BESIDE,
  DESK_BESIDE_DETAIL,
  CLOCK_LABEL,
  BANK_LOAD_LABEL,
  BANK_STATUS_LABEL,
  TYPHOON_BUTTON,
  CX254_BUTTON,
  QUEUE_TITLE,
  QUEUE_SUBTITLE,
  REASONING_TITLE,
  OPTIONS_TITLE,
  PANEL_EMPTY_TITLE,
  PANEL_EMPTY_DETAIL,
  DRAWER_TITLE,
  DRAWER_SPLIT,
  DRAWER_EMPTY_TITLE,
  DRAWER_EMPTY_DETAIL,
  PAGE_TITLE,
  PAGE_DESCRIPTION,
] as const;
