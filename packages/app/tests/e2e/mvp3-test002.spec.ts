import { expect, test } from "@playwright/test";

test("M3-TEST-002 mantém a agenda utilizável em viewport estreito", async ({ page }) => {
  await page.setViewportSize({ height: 812, width: 320 });

  await page.goto("/agenda", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Agenda" }))
    .toBeVisible();

  await expect(page.getByLabel("Data de referência"))
    .toBeVisible();

  await expect(page.getByRole("button", { name: "Dia" }))
    .toBeVisible();

  await expect(page.getByRole("button", { name: "Semana" }))
    .toBeVisible();

  await expect(page.getByRole("button", { name: "Mês" }))
    .toBeVisible();

  const geometry = await page.evaluate(() => {
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });

  expect(geometry.documentWidth)
    .toBeLessThanOrEqual(geometry.viewportWidth + 1);

  await page.getByRole("button", { name: "Semana" })
    .click();

  await expect(page.getByText("Nenhum compromisso local neste período."))
    .toBeVisible();

  await page.getByRole("button", { name: "Mês" })
    .click();

  await expect(page.getByText("Nenhum compromisso local neste período."))
    .toBeVisible();
});
