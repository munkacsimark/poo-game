import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("exports a profile and imports it back as a new profile", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: /^Switch profile/ }).click();

  await page.getByRole("button", { name: "Manage profiles" }).click();
  await page.getByRole("button", { name: /^Edit\s*Player\s*1\s*,/ }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("dialog").getByRole("button", { name: "Export" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("poo-game-player-1.poo");
  const file = await readFile(await download.path(), "utf8");
  expect(file).toMatch(/^POO1/);
  await page.keyboard.press("Escape");

  await page.getByLabel("Profile file to import").setInputFiles({
    name: "player.poo",
    mimeType: "application/octet-stream",
    buffer: Buffer.from(file),
  });
  await expect(page.getByRole("status")).toHaveText("Imported Player 1.");
  await expect(page.getByRole("button", { name: /^Edit\s*Player\s*1\s*2\s*,/ })).toBeVisible();

  // Any hand edit is rejected.
  const tampered = file.slice(0, -3) + (file.endsWith("AAA") ? "BBB" : "AAA");
  await page.getByLabel("Profile file to import").setInputFiles({
    name: "cheat.poo",
    mimeType: "application/octet-stream",
    buffer: Buffer.from(tampered),
  });
  await expect(page.getByRole("alert")).toHaveText("This profile file was modified or is damaged.");
});
