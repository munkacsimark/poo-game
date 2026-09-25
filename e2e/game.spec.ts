import { expect, test, type Page } from "@playwright/test";

/** Makes every game roll 0: one push is enough for a drop, and the drop is always 💩. */
const forceZeroRolls = (page: Page) =>
  page.addInitScript(() => {
    crypto.getRandomValues = (array) => {
      if (array instanceof Uint32Array) array.fill(0);
      return array;
    };
  });

const collection = (page: Page) => page.getByRole("list", { name: "Your collection" });
const pushButton = (page: Page) => page.getByRole("button", { name: /^Push the/ });

test("starts with one common emoji and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("./");

  await expect(page.getByRole("heading", { name: "Poo Game" })).toBeVisible();
  await expect(collection(page).getByRole("button")).toHaveCount(1);
  await expect(page.getByRole("button", { name: /^Common\s*1\s*of/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("pushing drops a new emoji that survives a reload", async ({ page }) => {
  await forceZeroRolls(page);
  await page.goto("./");

  await pushButton(page).click();

  await expect(page.getByRole("status")).toContainText("New Galaxy Opal!");
  await expect(page.getByRole("button", { name: "Push the 💩" })).toBeVisible();
  await expect(collection(page).getByRole("button")).toHaveCount(2);

  await page.reload();
  await expect(page.getByRole("button", { name: "Push the 💩" })).toBeVisible();
  await expect(collection(page).getByRole("button")).toHaveCount(2);
});

test("filters the collection by rarity", async ({ page }) => {
  await forceZeroRolls(page);
  await page.goto("./");
  await pushButton(page).click();
  await expect(collection(page).getByRole("button")).toHaveCount(2);

  await page.getByRole("button", { name: /^Galaxy Opal\s*1\s*of\s*1/ }).click();
  await expect(collection(page).getByRole("button")).toHaveCount(1);

  await page.getByRole("button", { name: /^Epic\s*0\s*of/ }).click();
  await expect(page.getByText("No Epic emojis yet. Keep pushing!")).toBeVisible();
});

test("the FAQ is a route: it opens over the game and Back closes it", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: "FAQ" }).click();

  const dialog = page.getByRole("dialog", { name: "FAQ" });
  await expect(dialog.getByText("How do I play?")).toBeVisible();
  await dialog.getByText("What are the drop rates?").click();
  await expect(dialog.getByRole("rowheader", { name: "Galaxy Opal" })).toBeVisible();
  await expect(page).toHaveURL(/\/poo-game\/faq$/);

  await page.goBack();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/poo-game\/$/);
  await page.goForward();
  await expect(dialog).toBeVisible();
});

test("deep links load directly and survive a reload", async ({ page }) => {
  await page.goto("./profiles/manage");
  await expect(page.getByRole("heading", { name: "Manage profiles" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Manage profiles" })).toBeVisible();

  await page.goto("./faq");
  await expect(page.getByRole("dialog", { name: "FAQ" })).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
  await expect(page).toHaveURL(/\/poo-game\/$/);

  await page.goto("./nope");
  await expect(page.getByRole("heading", { name: "Nothing to see here" })).toBeVisible();
});

test("does not scroll horizontally", async ({ page }) => {
  await page.goto("./");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("keeps working offline once installed", async ({ page, context }) => {
  await page.goto("./");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  await context.setOffline(true);
  await page.reload();
  await expect(pushButton(page)).toBeVisible();

  // Deep links are served the app shell too.
  await page.goto("./profiles/manage");
  await expect(page.getByRole("heading", { name: "Manage profiles" })).toBeVisible();
  await context.setOffline(false);
});

test("the version in the footer opens the changelog", async ({ page }) => {
  await page.goto("./");

  await page.getByRole("link", { name: /^What's new in v\d+\.\d+\.\d+$/ }).click();
  const dialog = page.getByRole("dialog", { name: "What's new" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("v0.1.0")).toBeVisible();

  await expect(page).toHaveURL(/\/poo-game\/changelog$/);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/poo-game\/$/);
});

test("the theme picker restyles the app and the choice survives a reload", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: "Theme" }).click();

  const dialog = page.getByRole("dialog", { name: "Theme" });
  await expect(page).toHaveURL(/\/poo-game\/theme$/);
  await dialog.getByText("Terminal").click();
  await dialog.getByText("Light", { exact: true }).click();

  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "hacker");
  await expect(html).toHaveAttribute("data-mode", "light");

  await page.keyboard.press("Escape");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "hacker");
  await expect(html).toHaveAttribute("data-mode", "light");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
