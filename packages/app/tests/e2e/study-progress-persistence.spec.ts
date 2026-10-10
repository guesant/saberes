import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

test.beforeEach(async ({ page }) => {
  // Keep this isolated test independent from the automatic PDF pre-download.
  // Network remains available for the local app; only its online indicator is
  // forced off, and PDF requests are blocked as a second safety boundary.
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "onLine", {
      configurable: true,
      get: () => false,
    });
  });
  await page.route(/\.pdf(?:[?#]|$)/iu, (route) => { return route.abort(); });
});

test("resposta e avaliação de questão permanecem no desempenho após recarregar", async ({
  page,
}) => {
  await page.goto("/questoes/1", { waitUntil: "domcontentloaded" });
  await validateRouteSettled(page);

  // QZ 2025, questão 1: gabarito oficial B.
  await page.getByRole("button", { name: /^B\)/u }).click();
  await page.getByRole("button", { name: "Responder" }).click();

  const responseDialog = page.getByRole("dialog");
  await responseDialog.getByRole("button", { name: "Seguro" }).click();
  await responseDialog.getByRole("button", { name: "Enviar resposta" }).click();
  await expect(page.getByText("Resposta correta", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Avaliar tentativa" }).click();
  const diagnosisDialog = page.getByRole("dialog");
  await diagnosisDialog
    .getByRole("button", { name: "Acertei com segurança" })
    .click();
  await diagnosisDialog.getByRole("button", { name: "Salvar avaliação" }).click();

  await page.reload({ waitUntil: "domcontentloaded" });
  await validateRouteSettled(page);
  await page.goto("/desempenho", { waitUntil: "domcontentloaded" });
  await validateRouteSettled(page);

  const attemptsMetric = page.getByText("tentativas", { exact: true }).locator("..");
  await expect(attemptsMetric.getByText("1", { exact: true })).toBeVisible();
});
