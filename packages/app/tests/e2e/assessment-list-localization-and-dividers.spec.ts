import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

test("avaliação carrega as traduções e separa todos os itens da lista", async ({ page }) => {
  await page.goto("/avaliacoes/lista-unicamp-questoes-catalogadas", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.getByText("Prática e avaliações", { exact: true }))
    .toBeVisible();

  await expect(page.getByRole("heading", { name: "Questões da lista" }))
    .toBeVisible();

  await expect(page.getByText("O simulado ainda não está disponível para esta lista. Você pode praticar as questões normalmente.", { exact: true }))
    .toBeVisible();

  await expect(page.getByText(/^assessment\./))
    .toHaveCount(0);

  const list = page.locator("#main-content .MuiList-root")
    .last();

  const itemCount = await list.locator(".MuiListItemButton-root")
    .count();

  expect(itemCount)
    .toBeGreaterThan(0);

  await expect(list.locator(".MuiDivider-root"))
    .toHaveCount(itemCount + 1);
});
