import { expect, test } from "@playwright/test";

test("carrega a aplicação e registra o service worker", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page)
    .toHaveTitle("Saberes");

  await expect(page.locator("#root")).not.toBeEmpty();

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
