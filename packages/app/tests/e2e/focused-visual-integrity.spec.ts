import { expect, test } from "@playwright/test";
import { validateDocumentOverflow } from "./validate-document-overflow.function";
import { validateLayoutMetadata } from "./validate-layout-metadata.function";
import { validateRouteSettled } from "./validate-route-settled.function";

const auditedRoutes = [
  "/preferencias",
  "/questoes/1",
  "/licoes/matematica.funcoes-graficos.aula-1",
  "/desempenho/detalhes",
  "/mapa/mapa-unicamp-2027",
  "/topicos/fisica.mecanica",
];

const screenWidths = [375, 768, 1280, 1920];

const colorSchemes = ["light", "dark"] as const;

const visualCases = screenWidths.flatMap((width) => {
  return colorSchemes.flatMap((colorScheme) => {
    return auditedRoutes.map((route) => { return { colorScheme, route, width }; });
  });
});

visualCases.forEach(({ colorScheme, route, width }) => {
  test(`@visual ${route} ${width}px ${colorScheme}`, async ({ page }) => {
    await page.setViewportSize({ height: 1000, width });

    await page.emulateMedia({ colorScheme });

    await page.goto(route, { waitUntil: "networkidle" });

    await validateRouteSettled(page);

    if (route === "/licoes/matematica.funcoes-graficos.aula-1") {
      await expect(page.locator(".katex"))
        .toHaveCount(1);

      await expect(page.locator(".katex-html"))
        .toBeVisible();

      await expect(page.getByText("Resumo rápido"))
        .toBeVisible();
    }

    await validateLayoutMetadata(page);

    await validateDocumentOverflow(page);

    const routeName = route.replaceAll("/", "-")
      .replace(/^-/, "");

    await expect(page)
      .toHaveScreenshot(`${routeName}-${width}-${colorScheme}.png`, {
        animations: "disabled",
        caret: "hide",
        fullPage: true,
      });
  });
});
