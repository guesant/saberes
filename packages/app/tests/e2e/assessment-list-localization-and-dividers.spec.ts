import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

test("avaliação carrega as traduções e separa todos os itens da lista", async ({
  page,
}) => {
  await page.goto("/avaliacoes/vu-2025-fase1-qz", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(
    page.getByText("Prática e avaliações", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Questões da lista" }),
  ).toBeVisible();

  await expect(
    page.getByText(
      "Simulado completo liberado, 300 min. A prática individual não inclui a questão anulada; a pontuação oficial é aplicada no simulado.",
      { exact: true },
    ),
  ).toBeVisible();

  await expect(page.getByText(/^assessment\./)).toHaveCount(0);

  const list = page.locator("#main-content .MuiList-root").last();

  const itemCount = await list.locator(".MuiListItemButton-root").count();

  expect(itemCount).toBeGreaterThan(0);

  const listItems = list.locator(":scope > .MuiListItem-root");

  await expect(listItems).toHaveCount(itemCount);

  const everyQuestionIsVisuallySeparated = await listItems
    .evaluateAll((items) => {
      return items.slice(1).every((item) => {
        const border = getComputedStyle(item).borderBlockStart;

        return (
          border.includes("solid") &&
          parseFloat(getComputedStyle(item).borderBlockStartWidth) > 0
        );
      });
    });

  expect(everyQuestionIsVisuallySeparated).toBe(true);
});
