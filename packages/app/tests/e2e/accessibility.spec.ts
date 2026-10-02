import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("mantém a página inicial sem violações WCAG críticas", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

    expect(results.violations).toEqual([]);
});
