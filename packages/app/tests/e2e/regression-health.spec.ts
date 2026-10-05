import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

test("@regression a aula numérica não fica presa em carregamento", async ({ page }) => {
  const pageErrors: string[] = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto("/licoes/1", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.getByRole("status")
    .filter({ hasText: /carregando/i }))
    .toHaveCount(0);

  await expect(page.locator("#main-content"))
    .toBeVisible();

  expect(pageErrors)
    .toEqual([]);
});

test("@regression o foco sincroniza cada transição com o estado local", async ({ page }) => {
  await page.goto("/foco", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Iniciar foco" })
    .click();

  await expect(page.getByRole("button", { name: "Pausar foco" }))
    .toBeEnabled();

  await page.getByRole("button", { name: "Pausar foco" })
    .click();

  await expect(page.getByRole("button", { name: "Retomar foco" }))
    .toBeEnabled();

  await page.getByRole("button", { name: "Retomar foco" })
    .click();

  await expect(page.getByRole("button", { name: "Pausar foco" }))
    .toBeEnabled();

  await page.getByRole("button", { name: "Encerrar foco" })
    .click();

  await expect(page.getByRole("button", { name: "Iniciar foco" }))
    .toBeEnabled();
});
