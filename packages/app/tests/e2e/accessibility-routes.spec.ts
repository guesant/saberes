import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const studyRoutes = [
  "/catalogo",
  "/meu-estudo",
  "/desempenho",
  "/revisoes",
  "/cursos/curso-sintetico-primeiro-estudo",
  "/plano/plano-primeiro-estudo",
  "/mapa/mapa-primeiro-estudo",
  "/topicos/primeiro-conceito",
  "/licoes/primeiro-conceito",
  "/questoes/1",
  "/avaliacoes/assessment-primeiro-estudo",
  "/metas",
  "/foco",
  "/academico",
  "/preferencias",
  "/meu-espaco",
];

studyRoutes.forEach((route) => {
  test(`mantém ${route} acessível`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    await expect(page.locator("#root")).not.toBeEmpty();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations)
      .toEqual([]);
  });
});
