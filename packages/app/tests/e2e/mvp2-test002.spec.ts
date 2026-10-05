import { expect, test } from "@playwright/test";
import { validateDocumentOverflow } from "./validate-document-overflow.function";
import { validateLayoutMetadata } from "./validate-layout-metadata.function";
import { validateVisualComposition } from "./validate-visual-composition.function";
import type { VisualAuditScenario } from "./visual-audit-scenario.type";

const studyRoutes = [
  "/",
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

const viewports = [
  { height: 812, name: "mobile-narrow", width: 320 },
  { height: 812, name: "mobile-wide", width: 430 },
  { height: 900, name: "tablet", width: 768 },
  { height: 900, name: "desktop", width: 1440 },
  { height: 900, name: "split-window", width: 640 },
];

viewports.forEach((viewport) => {
  test.describe(`M2-TEST-002 ${viewport.name}`, () => {
    test.use({ viewport: { height: viewport.height, width: viewport.width } });

    studyRoutes.forEach((route) => {
      test(`@mvp2-test002 @visual ${route} mantém composição e overflow`, async ({ page }) => {
        await page.goto(route, { waitUntil: "networkidle" });

        await expect(page.locator("#root"))
          .not.toBeEmpty();

        await validateLayoutMetadata(page);

        await validateDocumentOverflow(page);

        const scenario: VisualAuditScenario = {
          landmark: route,
          name: `${viewport.name}:${route}`,
          route,
        };

        await validateVisualComposition(page, scenario);
      });
    });
  });
});
