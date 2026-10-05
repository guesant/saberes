import { expect, test } from "@playwright/test";
import { validateVisualComposition } from "./validate-visual-composition.function";
import type { VisualAuditScenario } from "./visual-audit-scenario.type";

const scenarios: VisualAuditScenario[] = [
  { landmark: "Filtros salvos", name: "saved-filters", route: "/catalogo" },
  { landmark: "Metas de estudo", name: "study-goals", route: "/metas" },
  { landmark: "Foco e pausas", name: "focus-session", route: "/foco" },
  { landmark: "Preferências de estudo", name: "preferences", route: "/preferencias" },
  { landmark: "Meu espaço local", name: "personal-space", route: "/meu-espaco" },
];

const viewports = [
  { height: 1000, name: "desktop", width: 1600 },
  { height: 812, name: "mobile", width: 375 },
];

viewports.forEach((viewport) => {
  test.describe(`visual audit ${viewport.name}`, () => {
    test.use({ viewport: { height: viewport.height, width: viewport.width } });

    scenarios.forEach((scenario) => {
      test(`@visual-audit ${scenario.name} identifies the attached screen`, async ({ page }) => {
        await page.goto(scenario.route, { waitUntil: "networkidle" });

        await expect(page.getByText(scenario.landmark, { exact: true })
          .first())
          .toBeVisible();

        await validateVisualComposition(page, scenario);
      });
    });
  });
});
