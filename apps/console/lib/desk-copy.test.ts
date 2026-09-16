import { describe, expect, it } from "vitest";
import {
  CX254_BUTTON,
  DESK_BESIDE,
  DESK_COPY_SURFACE,
  DESK_HALLWAY,
  DESK_PAIRING,
  DRAWER_SPLIT,
  TYPHOON_BUTTON,
} from "./desk-copy";

describe("handling-first desk copy (flylab steal)", () => {
  const surface = DESK_COPY_SURFACE.join("\n");

  it("names Transfer + Airport Systems and the family desk, not an AI noun", () => {
    expect(surface).toContain("HKG Transfer");
    expect(surface).toContain("Airport Systems");
    expect(surface).toContain("Q77");
    expect(surface).toContain(DESK_PAIRING);
    expect(surface).toContain(DESK_HALLWAY);
    expect(surface).toMatch(/doesn't split the family/);
    expect(surface).not.toMatch(/AI notification/i);
    expect(surface).not.toMatch(/\bAI agent\b/i);
    expect(surface).not.toMatch(/\bdashboard\b/i);
    expect(surface).not.toMatch(/\bsuper-app\b/i);
  });

  it("keeps FlyLab split: engine ranks, LLM drafts, human Approve", () => {
    expect(DRAWER_SPLIT).toContain("Engine ranked this flight");
    expect(DRAWER_SPLIT).toContain("LLM drafted the SMS");
    expect(DRAWER_SPLIT).toContain("Approve is the only send");
    expect(surface).toContain(DRAWER_SPLIT);
  });

  it("says beside Passenger Recovery, not instead", () => {
    expect(DESK_BESIDE).toBe("Beside Passenger Recovery, not instead");
    expect(surface).toContain(DESK_BESIDE);
    expect(surface).toContain("UM / WCH");
    expect(surface).not.toMatch(/replace Passenger Recovery/i);
  });

  it("keeps DEMO click labels for typhoon load and CX254", () => {
    expect(TYPHOON_BUTTON).toBe("Simulate Typhoon Delay");
    expect(CX254_BUTTON).toBe("Late Inbound CX254");
    expect(surface).toContain(TYPHOON_BUTTON);
    expect(surface).toContain(CX254_BUTTON);
  });
});
