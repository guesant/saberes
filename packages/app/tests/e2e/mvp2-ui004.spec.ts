import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const homeRoute = "/meu-estudo";

const viewports = [
  { height: 812, name: "mobile", width: 320 },
  { height: 812, name: "mobile-wide", width: 430 },
  { height: 900, name: "tablet", width: 768 },
  { height: 900, name: "desktop", width: 1280 },
];

viewports.forEach((viewport) => {
  test(`M2-UI-004 ${viewport.name} preserves navigation and overflow`, async ({ page }) => {
    await page.setViewportSize({ height: viewport.height, width: viewport.width });

    await page.goto(homeRoute, { waitUntil: "networkidle" });

    await expect(page.locator("#main-content"))
      .toBeVisible();

    const geometry = await page.evaluate(() => {
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });

    expect(geometry.documentWidth)
      .toBeLessThanOrEqual(geometry.viewportWidth + 1);

    const bottomNavigation = page.locator('[data-ui-layout="bottom-tabs"]');

    const drawer = page.locator('[data-ui-navigation="drawer"] .MuiDrawer-paper');

    if (viewport.width < 900) {
      await expect(bottomNavigation)
        .toBeVisible();

      await expect(drawer)
        .toBeHidden();
    }

    if (viewport.width >= 900) {
      await expect(bottomNavigation)
        .toBeHidden();

      await expect(drawer)
        .toBeVisible();
    }
  });
});

test("M2-UI-004 keeps the primary flow keyboard reachable", async ({ page }) => {
  await page.goto(homeRoute, { waitUntil: "networkidle" });

  await page.keyboard.press("Tab");

  await expect(page.locator(":focus"))
    .toBeVisible();

  const focusState = await page.locator(":focus")
    .evaluate((element) => {
      const styles = window.getComputedStyle(element);

      return {
        outlineStyle: styles.outlineStyle,
        outlineWidth: styles.outlineWidth,
      };
    });

  expect(focusState.outlineStyle).not.toBe("none");

  expect(focusState.outlineWidth).not.toBe("0px");
});

test("M2-UI-004 supports dark mode without accessibility regressions", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });

  await page.goto(homeRoute, { waitUntil: "networkidle" });

  const colors = await page.evaluate(() => {
    return {
      background: window.getComputedStyle(document.body).backgroundColor,
      color: window.getComputedStyle(document.body).color,
    };
  });

  expect(colors.background)
    .toBe("rgb(18, 20, 23)");

  expect(colors.color)
    .toBe("rgb(243, 244, 246)");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  expect(results.violations)
    .toEqual([]);
});

test("M2-UI-004 supports enlarged text without horizontal overflow", async ({ page }) => {
  await page.goto(homeRoute, { waitUntil: "networkidle" });

  await page.evaluate(() => {
    document.documentElement.style.fontSize = "125%";
  });

  const geometry = await page.evaluate(() => {
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });

  expect(geometry.documentWidth)
    .toBeLessThanOrEqual(geometry.viewportWidth + 1);
});
