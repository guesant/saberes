import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

test("simulado completo aplica a pontuação oficial à questão anulada", async ({ page }) => {
  await page.goto("/avaliacoes/vu-2025-fase1-qz", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Começar simulado" })
    .click();

  await expect(page)
    .toHaveURL(/\/sessoes\/questoes\//u);

  await validateRouteSettled(page);

  await page.reload({ waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.getByRole("button", { name: "Finalizar", exact: true }))
    .toBeVisible();

  await page.getByRole("button", { name: "Finalizar", exact: true })
    .click();

  await expect(page.getByText(/Deseja concluir agora\?/u))
    .toBeVisible();

  await page.getByRole("button", { name: "Concluir simulado" })
    .click();

  await expect(page.getByRole("heading", { name: "Simulado concluído" }))
    .toBeVisible();

  await expect(page.getByText("1 de 72 pontos", { exact: true }))
    .toBeVisible();

  await expect(
    page.getByText(
      "Questão anulada · pontuação atribuída conforme a regra da avaliação.",
      { exact: true },
    ),
  )
    .toBeVisible();

  await expect(page.getByRole("heading", { name: "Questão 53 de 72" }))
    .toBeVisible();
});
