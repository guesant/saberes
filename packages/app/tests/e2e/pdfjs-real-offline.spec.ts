import { expect, test } from "@playwright/test";

test("PDF.js renderiza página do caderno oficial após o app ficar offline", async ({
  page,
  context,
}) => {
  const pdfPath = "/data/official-pdfs/2027-simulation/simulado_Q_T.pdf";

  const pdfUrl = `http://127.0.0.1:4173${pdfPath}`;

  await page.goto("/questoes/2737");

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  await page.waitForFunction(() => {return Boolean(navigator.serviceWorker.controller);});

  const fetchedPdf = await page.evaluate(async ({ path, url }) => {
    const manifestText = await fetch("/data/asset-manifest.jsonl")
      .then((response) => {
        return response.text();
      });

    const manifestEntry = manifestText
      .split("\n")
      .filter(Boolean)
      .map((line) => {return JSON.parse(line);})
      .find((entry) => {return entry.path === path;});

    const response = await fetch(url);

    const bytes = await response.arrayBuffer();

    const digest = await crypto.subtle.digest("SHA-256", bytes);

    const actualSha256 = Array.from(new Uint8Array(digest))
      .map((value) => {return value.toString(16)
        .padStart(2, "0");})
      .join("");

    return {
      ok: response.ok,
      size: bytes.byteLength,
      signature: new TextDecoder()
        .decode(bytes.slice(0, 5)),
      expectedSha256: manifestEntry?.sha256,
      actualSha256,
    };
  }, { path: pdfPath.replace(/^\/data\//u, ""), url: pdfUrl });

  expect(fetchedPdf)
    .toMatchObject({ ok: true, signature: "%PDF-" });

  expect(fetchedPdf.size)
    .toBeGreaterThan(100_000);

  expect(fetchedPdf.actualSha256)
    .toBe(fetchedPdf.expectedSha256);

  await page.waitForFunction(async (url) => {
    const cache = await caches.open("saberes-official-study-assets");

    return Boolean(await cache.match(url));
  }, pdfUrl);

  await context.setOffline(true);

  await page.goto("/questoes/2737");

  await page.getByRole("button", { name: /Abrir página 3/ })
    .click();

  const renderedPage = page.getByLabel(/Página 3 do documento/);

  await expect(renderedPage)
    .toBeVisible();

  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas[aria-label^="Página 3 do documento"]');

    return canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0;
  });

  const renderedPixels = await renderedPage.evaluate((element) => {
    const canvas = element as HTMLCanvasElement;

    const canvasContext = canvas.getContext("2d");

    if (!canvasContext) {
      throw new Error("PDF.js did not create a readable canvas context.");
    }

    const { data } = canvasContext.getImageData(0, 0, canvas.width, canvas.height);

    let nonWhitePixels = 0;

    for (let index = 0; index < data.length; index += 4) {
      if (data[index] < 245 || data[index + 1] < 245 || data[index + 2] < 245) {
        nonWhitePixels += 1;
      }
    }

    return {
      width: canvas.width,
      height: canvas.height,
      nonWhitePixels,
    };
  });

  expect(renderedPixels.width)
    .toBeGreaterThan(0);

  expect(renderedPixels.height)
    .toBeGreaterThan(0);

  expect(renderedPixels.nonWhitePixels)
    .toBeGreaterThan(500);
});
