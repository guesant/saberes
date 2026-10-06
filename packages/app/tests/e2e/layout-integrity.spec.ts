import { expect, test } from "@playwright/test";
import { createLayoutSnapshotName } from "./create-layout-snapshot-name.function";
import { validateControlGeometry } from "./validate-control-geometry.function";
import { validateDocumentOverflow } from "./validate-document-overflow.function";
import { validateLayoutMetadata } from "./validate-layout-metadata.function";

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
  { height: 812, name: "mobile", width: 375 },
  { height: 800, name: "desktop", width: 1280 },
];

viewports.forEach((viewport) => {
  test.describe(`layout ${viewport.name}`, () => {
    test.use({ viewport: { height: viewport.height, width: viewport.width } });

    studyRoutes.forEach((route) => {
      test(`@layout ${route} preserves geometry`, async ({ page }) => {
        await page.goto(route, { waitUntil: "networkidle" });

        await expect(page.locator("#root")).not.toBeEmpty();

        await validateLayoutMetadata(page);

        await validateControlGeometry(page);

        await validateDocumentOverflow(page);
      });

      test(`@visual ${route} matches the ${viewport.name} baseline`, async ({ page }) => {
        await page.goto(route, { waitUntil: "networkidle" });

        await expect(page.locator("#root")).not.toBeEmpty();

        await expect(page)
          .toHaveScreenshot(createLayoutSnapshotName(route, viewport.name), {
            animations: "disabled",
            caret: "hide",
            fullPage: true,
          });
      });
    });
  });
});
