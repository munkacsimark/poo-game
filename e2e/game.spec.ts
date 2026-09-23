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

test("the FAQ link in the footer opens the FAQ", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: "FAQ" }).click();

  const dialog = page.getByRole("dialog", { name: "FAQ" });
  await expect(dialog.getByText("How do I play?")).toBeVisible();
  await dialog.getByText("What are the drop rates?").click();
  await expect(dialog.getByRole("rowheader", { name: "Galaxy Opal" })).toBeVisible();
  await expect(page).toHaveURL(/#faq$/);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(/#faq$/);
});

test("#faq opens the FAQ directly", async ({ page }) => {
  await page.goto("./#faq");
  await expect(page.getByRole("dialog", { name: "FAQ" })).toBeVisible();
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
  await context.setOffline(false);
});

test("the version in the footer opens the changelog", async ({ page }) => {
  await page.goto("./");

  await page.getByRole("button", { name: /^Version \d+\.\d+\.\d+/ }).click();
  const dialog = page.getByRole("dialog", { name: "What's new" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("v0.1.0")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
