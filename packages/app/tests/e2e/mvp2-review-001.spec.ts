import { expect, test } from "@playwright/test";

test("@mvp2-review-001 demonstra o primeiro estudo sem rede", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { height: 900, width: 1280 },
  });

  const page = await context.newPage();

  const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:8080";

  const localOrigin = new URL(baseUrl).origin;

  const blockedOrigins: string[] = [];

  await page.route("**/*", async (route) => {
    const requestOrigin = new URL(route.request().url()).origin;

    if (requestOrigin === localOrigin) {
      await route.continue();

      return;
    }

    blockedOrigins.push(requestOrigin);

    await route.abort();
  });

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator("#main-content")).toBeVisible();

  await page.locator('a[href="/catalogo"]').first().click();

  await expect(page).toHaveURL(/\/catalogo$/);

  await page.locator('a[href^="/cursos/"]').first().click();

  await expect(page).toHaveURL(/\/cursos\/[^/]+$/);

  await expect(
    page.getByRole("button", { name: "Começar curso" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Começar curso" }).click();

  await expect(page).toHaveURL(
    /\/licoes\/unicamp-2027-2468-conceito\?course=unicamp-2027-primeira-fase&step=1$/,
  );

  await page.goBack();

  await expect(
    page.getByRole("button", { name: "Continuar curso" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Continuar curso" }).click();

  await expect(page).toHaveURL(
    /\/licoes\/unicamp-2027-2468-conceito\?course=unicamp-2027-primeira-fase&step=1$/,
  );

  await context.setOffline(true);

  await page.locator('a[href="/meu-estudo"]').first().click();

  await expect(page).toHaveURL(/\/meu-estudo$/);

  await expect(
    page.getByRole("heading", { name: "Estude com método." }),
  ).toBeVisible();

  await page.locator('a[href="/catalogo"]').first().click();

  await expect(page).toHaveURL(/\/catalogo$/);

  await expect(
    page.getByRole("heading", { name: "O que você quer estudar hoje?" }),
  ).toBeVisible();

  expect(
    blockedOrigins.every((origin) => {
      return origin !== localOrigin;
    }),
  ).toBe(true);

  await context.close();
});
