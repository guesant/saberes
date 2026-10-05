import { expect, test } from "@playwright/test";

test("M3-TEST-001 keeps the personal workspace available without network", async ({ page }) => {
  await page.goto("/meu-espaco", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Meu espaço local" }))
    .toBeVisible();

  await page.context()
    .setOffline(true);

  await expect(page.getByRole("heading", { name: "Meu espaço local" }))
    .toBeVisible();

  await expect(page.getByRole("heading", { name: "Criar algo local" }))
    .toBeVisible();
});
