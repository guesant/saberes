import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

([375, 768, 1280, 1920] as const).forEach((width) => {
  test(`practice catalog cards keep a 16px grid gap and at most two columns at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 900, width });

    await page.goto("/catalogo?modo=praticar", { waitUntil: "networkidle" });

    await validateRouteSettled(page);

    await expect(page.locator("#main-content .MuiCard-root")
      .first())
      .toBeVisible({ timeout: 15_000 });

    const grid = page.locator("#main-content .MuiBox-root")
      .filter({ has: page.locator(".MuiCard-root") });

    const geometry = await grid.evaluateAll((elements) => {
      const candidates = elements.filter((element) => {
        return getComputedStyle(element).display === "grid" &&
          Array.from(element.children)
            .filter((child) => { return child.querySelector(".MuiCard-root"); }).length >= 2;
      });

      const element = candidates.at(-1);

      if (!element) {
        return null;
      }

      const style = getComputedStyle(element);

      const cards = Array.from(element.children)
        .filter((child) => { return child.querySelector(".MuiCard-root"); });

      const columns = new Set(cards.map((card) => { return Math.round(card.getBoundingClientRect().left); }));

      return { columnGap: Number.parseFloat(style.columnGap), columns: columns.size, rowGap: Number.parseFloat(style.rowGap) };
    });

    expect(geometry, "the practice catalog should render its card grid")
      .not.toBeNull();

    expect(geometry?.columns)
      .toBeLessThanOrEqual(2);

    expect(geometry?.columnGap)
      .toBe(16);

    expect(geometry?.rowGap)
      .toBe(16);
  });
});
