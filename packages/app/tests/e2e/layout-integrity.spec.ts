import { expect, test } from "@playwright/test";
import { createLayoutSnapshotName } from "./create-layout-snapshot-name.function";
import { validateControlGeometry } from "./validate-control-geometry.function";
import { validateDocumentOverflow } from "./validate-document-overflow.function";
import { validateRenderedLayout } from "./validate-rendered-layout.function";

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

        await expect(page.locator("#main-content"))
          .toBeVisible({ timeout: 15_000 });

        await validateRenderedLayout(page);

        await validateControlGeometry(page);

        await validateDocumentOverflow(page);
      });

      test(`@visual ${route} matches the ${viewport.name} baseline`, async ({ page }) => {
        await page.goto(route, { waitUntil: "networkidle" });

        await expect(page.locator("#root")).not.toBeEmpty();

        await expect(page.locator("#main-content"))
          .toBeVisible({ timeout: 15_000 });

        await expect(page)
          .toHaveScreenshot(createLayoutSnapshotName(route, viewport.name), {
            animations: "disabled",
            caret: "hide",
            fullPage: true,
          });
      });
    });

    test("@layout vertical scrolling stays inside main", async ({ page }) => {
      await page.goto("/mapa/mapa-primeiro-estudo", { waitUntil: "networkidle" });


      const main = page.locator("#main-content");

      await expect(main)
        .toBeVisible({ timeout: 15_000 });

      const initialGeometry = await page.evaluate(() => {
        const mainElement = document.querySelector<HTMLElement>("#main-content");

        const toolbar = document.querySelector<HTMLElement>("header.MuiAppBar-root");

        if (!mainElement || !toolbar) {
          throw new Error("Shell scroll containers are missing");
        }

        const longContent = document.createElement("div");

        longContent.setAttribute("aria-hidden", "true");

        longContent.style.height = "2000px";

        mainElement.append(longContent);

        return {
          documentHeight: document.documentElement.scrollHeight,
          documentTop: document.documentElement.scrollTop,
          mainClientHeight: mainElement.clientHeight,
          mainScrollHeight: mainElement.scrollHeight,
          toolbarTop: toolbar.getBoundingClientRect().top,
          viewportHeight: window.innerHeight,
        };
      });

      expect(initialGeometry.documentHeight)
        .toBeLessThanOrEqual(
          initialGeometry.viewportHeight + 1,
        );

      expect(initialGeometry.mainScrollHeight)
        .toBeGreaterThan(initialGeometry.mainClientHeight);

      await main.evaluate((element) => {
        element.scrollTo({ top: 300 });
      });

      await expect
        .poll(() => {
          return main.evaluate((element) => {
            return element.scrollTop;
          });
        })
        .toBeGreaterThan(0);

      const scrolledGeometry = await page.evaluate(() => {
        const toolbar = document.querySelector<HTMLElement>("header.MuiAppBar-root");

        if (!toolbar) {
          throw new Error("Shell navigation is missing");
        }

        return {
          documentTop: document.documentElement.scrollTop,
          toolbarTop: toolbar.getBoundingClientRect().top,
        };
      });

      expect(scrolledGeometry.documentTop)
        .toBe(0);

      expect(scrolledGeometry.toolbarTop)
        .toBeCloseTo(initialGeometry.toolbarTop, 0);

    });
  });
});
