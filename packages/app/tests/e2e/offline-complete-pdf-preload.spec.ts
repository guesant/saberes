import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

interface AssetManifestRecord {
  appUrlSuffix: string;
  mediaType: string;
}

test.setTimeout(180_000);

test("ao abrir o app, baixa em background todos os PDFs oficiais do manifesto", async ({ page }) => {
  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  const expectedPdfPaths = await page.evaluate(async () => {
    const manifestResponse = await fetch("/data/asset-manifest.jsonl");

    const manifestText = await manifestResponse.text();

    return manifestText
      .split("\n")
      .filter(Boolean)
      .map((line) => {return JSON.parse(line) as AssetManifestRecord;})
      .filter((asset) => {return asset.mediaType === "application/pdf";})
      .map((asset) => {return new URL(asset.appUrlSuffix, window.location.origin).pathname;});
  });

  expect(expectedPdfPaths.length)
    .toBeGreaterThan(0);

  await expect.poll(async () => {
    return page.evaluate(async (paths) => {
      const cache = await caches.open("saberes-official-study-assets");

      const cachedPaths = new Set(
        (await cache.keys()).map((request) => {return new URL(request.url).pathname;}),
      );

      return paths.filter((path) => {return !cachedPaths.has(path);});
    }, expectedPdfPaths);
  }, { timeout: 150_000, intervals: [500, 1000, 2000] })
    .toEqual([]);

  await expect(
    page.getByText("Os PDFs oficiais estão prontos para consulta offline neste dispositivo."),
  )
    .toBeVisible();

  await page.context()
    .setOffline(true);

  await page.goto("/questoes/2737");

  await validateRouteSettled(page);

  await page.getByRole("button", { name: /Abrir página 3/u })
    .click();

  const renderedPage = page.getByLabel(/Página 3 do documento/u);

  await expect(renderedPage)
    .toBeVisible();

  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas[aria-label^="Página 3 do documento"]');

    return canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0;
  });

  const offlinePageDimensions = await renderedPage.evaluate((element) => {
    const canvas = element as HTMLCanvasElement;

    return { width: canvas.width, height: canvas.height };
  });

  expect(offlinePageDimensions.width)
    .toBeGreaterThan(0);

  expect(offlinePageDimensions.height)
    .toBeGreaterThan(0);
});
