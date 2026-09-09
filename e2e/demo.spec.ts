import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("6-step stage demo", async ({ page }) => {
  let selectedPnr = "";

  await test.step("1. Load the console", async () => {
    await page.goto("/");
    const clock = page.getByTestId("station-clock");
    await expect(clock).not.toHaveText("—", { timeout: 60_000 });
    await expect(page.getByTestId("loading-block")).toHaveCount(0);
    await expect(clock).toContainText("HKT");
    await expect(clock).toContainText("2026-11-16");
    await expect(page.getByTestId("sim-badge")).toHaveText("SIM");
  });

  await test.step("2. Live triage queue from sim + engine", async () => {
    await expect(page.getByTestId("queue-item").first()).toBeVisible();
    await expect(page.getByTestId("quiet-count")).toContainText("OK — silent");
    await expect(page.getByTestId("engine-reasoning")).toBeVisible();
    await expect(page.getByTestId("engine-reasoning")).toContainText(/Slack is -?\d+ minutes/);
  });

  await test.step("3. Simulate Typhoon Delay", async () => {
    const delayed = page.getByTestId("delayed-flights");
    const before = await delayed.innerText();
    await page.getByTestId("btn-typhoon").click();
    await expect(page.getByTestId("btn-typhoon")).toBeEnabled();
    await expect(delayed).not.toHaveText(before);
    await expect(page.getByTestId("queue-item").first()).toBeVisible();
    await expect(page.getByTestId("queue-peak")).toContainText("Peak");
    await expect(page.getByTestId("station-clock")).toContainText("HKT");
  });

  await test.step("4. Late Inbound CX254", async () => {
    await page.getByTestId("btn-cx254").click();
    await expect(page.getByTestId("btn-cx254")).toBeEnabled();
    const cxRow = page.getByTestId("queue-item").filter({ hasText: "CX254" }).first();
    await expect(cxRow).toBeVisible();
    await cxRow.click();
    await expect(page.getByTestId("connection-panel")).toContainText(/Delay [1-9]/);
  });

  await test.step("5. Queue updates and recovery options", async () => {
    const withOptions = page.locator('[data-testid="queue-item"][data-has-options="true"]').first();
    await expect(withOptions).toBeVisible();
    selectedPnr = (await withOptions.getAttribute("data-pnr")) ?? "";
    expect(selectedPnr).not.toBe("");
    await withOptions.click();
    const option = page.locator("[data-recovery-option='true']").first();
    await expect(option).toBeVisible();
    await option.click();
  });

  await test.step("6. Draft (guarded) + approve", async () => {
    await expect(page.getByTestId("draft-badge")).toBeVisible();
    await expect(page.getByTestId("loading-block")).toHaveCount(0);
    const message = page.getByTestId("draft-message");
    await expect(message).not.toHaveValue("");
    const text = await message.inputValue();
    expect(text.length).toBeGreaterThan(10);
    await expect(page.getByTestId("approve-rebooking")).toBeEnabled();
    await page.getByTestId("approve-rebooking").click();
    await expect(page.locator(`[data-pnr="${selectedPnr}"]`)).toHaveCount(0);
  });
});
