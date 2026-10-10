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
  test(`M2-UI-004 ${viewport.name} opens overlay navigation and preserves layout`, async ({ page }) => {
    await page.setViewportSize({ height: viewport.height, width: viewport.width });

    await page.goto(homeRoute, { waitUntil: "networkidle" });

    await expect(page.locator("#main-content"))
      .toBeVisible();

    const geometry = await page.evaluate(() => {
      const appBar = document.querySelector<HTMLElement>("header.MuiAppBar-root");

      return {
        appBarLeft: appBar?.getBoundingClientRect().left ?? 0,
        appBarWidth: appBar?.getBoundingClientRect().width ?? 0,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });

    expect(geometry.documentWidth)
      .toBeLessThanOrEqual(geometry.viewportWidth + 1);

    expect(geometry.appBarWidth)
      .toBeLessThanOrEqual(500);

    expect(geometry.appBarLeft + geometry.appBarWidth / 2)
      .toBeCloseTo(geometry.viewportWidth / 2, 0);

    await expect(page.getByRole("navigation", { name: "Navegação principal" }))
      .toHaveCount(0);

    const drawer = page.getByTestId("navigation-drawer")
      .locator(".MuiDrawer-paper");

    await expect(drawer)
      .toBeHidden();

    await page.getByRole("button", { name: "Abrir menu de navegação" })
      .click();

    await expect(drawer)
      .toBeVisible();

    await expect.poll(() => drawer.evaluate((element) => getComputedStyle(element).transform))
      .toBe("none");

    const drawerGeometry = await page.evaluate(() => {
      const shell = document.querySelector<HTMLElement>('[data-testid="page-surface"]');
      const paper = document.querySelector<HTMLElement>('[data-testid="navigation-drawer"] .MuiDrawer-paper');
      const backdrop = document.querySelector<HTMLElement>('[data-testid="navigation-drawer"] .MuiBackdrop-root');
      const shellRect = shell?.getBoundingClientRect();
      const paperRect = paper?.getBoundingClientRect();
      const backdropRect = backdrop?.getBoundingClientRect();

      return {
        shellLeft: shellRect?.left ?? -1,
        shellWidth: shellRect?.width ?? 0,
        drawerLeft: paperRect?.left ?? -1,
        backdropLeft: backdropRect?.left ?? -1,
        backdropWidth: backdropRect?.width ?? 0,
      };
    });

    expect(drawerGeometry.drawerLeft)
      .toBeCloseTo(drawerGeometry.shellLeft, 0);

    expect(drawerGeometry.backdropLeft)
      .toBeCloseTo(drawerGeometry.shellLeft, 0);

    expect(drawerGeometry.backdropWidth)
      .toBeCloseTo(drawerGeometry.shellWidth, 0);

    await page.keyboard.press("Escape");

    await expect(drawer)
      .toBeHidden();
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
