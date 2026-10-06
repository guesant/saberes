import { expect, test } from "@playwright/test";
import { validateNoDetails } from "./validate-no-details.function";
import { validateRouteSettled } from "./validate-route-settled.function";
import { validateVisibleControlsNamed } from "./validate-visible-controls-named.function";

const flowRoutes = [
  ["home", "/"],
  ["catalog", "/catalogo"],
  ["my study", "/meu-estudo"],
  ["performance", "/desempenho"],
  ["reviews", "/revisoes"],
  ["course", "/cursos/fundamentos-para-vestibulares"],
  ["study plan", "/plano/trilha-30-dias-unicamp-2027"],
  ["knowledge map", "/mapa/mapa-unicamp-2027"],
  ["topic", "/topicos/fisica.mecanica"],
  ["lesson by slug", "/licoes/fisica.mecanica.aula-1"],
  ["lesson by numeric id", "/licoes/1"],
  ["question", "/questoes/1"],
  ["assessment", "/avaliacoes/lista-unicamp-questoes-catalogadas"],
  ["goals", "/metas"],
  ["focus", "/foco"],
  ["academic", "/academico"],
  ["preferences", "/preferencias"],
  ["personal workspace", "/meu-espaco"],
  ["calendar", "/agenda"],
];

flowRoutes.forEach(([name, path]) => {
  test(`todos os estados da tela ${name} chegam ao fim`, async ({ page }) => {
    const pageErrors: string[] = [];

    const consoleErrors: string[] = [];

    const failedRequests: string[] = [];

    const failedResponses: string[] = [];

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    page.on("requestfailed", (request) => {
      failedRequests.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText || "unknown"}`);
    });

    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedResponses.push(`${response.status()} ${response.request()
          .method()} ${response.url()}`);
      }
    });

    await page.goto(path, { waitUntil: "networkidle" });

    await validateRouteSettled(page);

    await validateNoDetails(page);

    await expect(page.locator("#main-content"))
      .toBeVisible();

    await validateVisibleControlsNamed(page);

    await expect(page.locator('[role="alert"].MuiAlert-standardError'))
      .toHaveCount(0);

    expect(pageErrors, "a rota saudável não deve lançar erros JavaScript")
      .toEqual([]);

    expect(consoleErrors, "a rota saudável não deve escrever erros no console")
      .toEqual([]);

    expect(failedRequests, "a rota saudável não deve possuir requisições falhas")
      .toEqual([]);

    expect(failedResponses, "a rota saudável não deve possuir respostas HTTP de erro")
      .toEqual([]);
  });
});

test("uma rota com recurso ausente apresenta estado de não encontrado sem erro técnico", async ({ page }) => {
  const pageErrors: string[] = [];

  const consoleErrors: string[] = [];

  const failedRequests: string[] = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText || "unknown"}`);
  });

  await page.goto("/sessoes/questoes/missing-session", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.locator("#main-content"))
    .toBeVisible();

  await expect(page.locator('[role="alert"].MuiAlert-standardInfo'))
    .toBeVisible();

  await validateVisibleControlsNamed(page);

  expect(pageErrors, "um erro tratado não deve lançar erro JavaScript")
    .toEqual([]);

  expect(consoleErrors, "um erro tratado não deve escrever erro no console")
    .toEqual([]);

  expect(failedRequests, "um erro tratado não deve depender de requisição falha")
    .toEqual([]);
});

test("listas do curso têm bordas externas, divisores entre itens e rótulos traduzidos", async ({ page }) => {
  await page.goto("/cursos/fundamentos-para-vestibulares", { waitUntil: "networkidle" });
  await validateRouteSettled(page);

  const list = page.locator("#main-content .MuiCard-root .MuiList-root").first();
  await expect(list).toBeVisible();
  await expect(page.getByRole("link", { name: /Pratique a base/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Revisão rápida de funções/ })).toBeVisible();
  await expect(page.getByText("practice", { exact: true })).toHaveCount(0);
  await expect(page.getByText("review", { exact: true })).toHaveCount(0);

  const borders = await list.evaluate((element) => {
    const style = getComputedStyle(element);
    const firstChild = element.firstElementChild;
    const secondChild = firstChild?.nextElementSibling;

    return {
      top: style.borderTopWidth,
      bottom: style.borderBottomWidth,
      between: secondChild ? getComputedStyle(secondChild).borderTopWidth : "0px",
    };
  });

  expect(borders).toEqual({ top: "1px", bottom: "1px", between: "1px" });
});

test("ações de prática e revisão do curso abrem seus fluxos", async ({ page }) => {
  await page.goto("/cursos/fundamentos-para-vestibulares", { waitUntil: "networkidle" });
  await validateRouteSettled(page);

  const practiceLink = page.getByRole("link", { name: /Pratique a base/ });
  const reviewLink = page.getByRole("link", { name: /Revisão rápida de funções/ });

  await expect(practiceLink).toHaveAttribute("href", /\/questoes\/\d+|\/catalogo\?modo=praticar/);
  await expect(reviewLink).toHaveAttribute("href", "/revisoes");

  await reviewLink.click();
  await expect(page).toHaveURL(/\/revisoes$/);
  await validateRouteSettled(page);

  await page.goBack();
  await validateRouteSettled(page);
  await practiceLink.click();
  await validateRouteSettled(page);
  await expect(page).toHaveURL(/\/questoes\/\d+|\/catalogo\?modo=praticar/);
});
