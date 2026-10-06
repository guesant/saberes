import { expect, test } from "@playwright/test";

test("mostra a aplicação sem esperar a verificação de atualização", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#main-content"))
    .toBeVisible({ timeout: 2_500 });
});

test("carrega a aplicação e registra o service worker", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page)
    .toHaveTitle("Saberes");

  await expect(page.locator("#root")).not.toBeEmpty();

  await expect(page.locator("#main-content"))
    .toBeVisible();

  await expect(page.locator(".MuiButton-root"))
    .not.toHaveCount(0);

  const actionButtonsHaveLeadingIcons = await page.locator(".MuiButton-root")
    .evaluateAll((buttons) => {
      return buttons.every((button) => {return button.querySelector(".MuiButton-startIcon");});
    });

  expect(actionButtonsHaveLeadingIcons)
    .toBe(true);

  await expect(page.locator("meta[name=description]"))
    .toHaveAttribute("content", /Saberes/);

  await expect
    .poll(() => {
      return page.evaluate(async () => {
        return (await navigator.serviceWorker?.getRegistrations())?.length ?? 0;
      });
    })
    .toBeGreaterThan(0);
});
