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

  await page.waitForFunction(() => {
    return Boolean(navigator.serviceWorker.controller);
  });

  const fetchedPdf = await page.evaluate(
    async ({ path, url }) => {
      const manifestResponse = await fetch("/data/asset-manifest.jsonl");

      const manifestText = await manifestResponse.text();

      const manifestLines = manifestText.split("\n");

      const nonEmptyManifestLines = manifestLines.filter(Boolean);

      const manifestRecords = nonEmptyManifestLines.map((line) => {
        return JSON.parse(line);
      });

      const manifestEntry = manifestRecords.find((entry) => {
        return entry.path === path;
      });

      const response = await fetch(url);

      const bytes = await response.arrayBuffer();

      const digest = await crypto.subtle.digest("SHA-256", bytes);

      const digestBytes = Array.from(new Uint8Array(digest));

      const hexadecimalBytes = digestBytes.map((value) => {
        return value.toString(16);
      });

      const paddedHexadecimalBytes = hexadecimalBytes.map((value) => {
        return value.padStart(2, "0");
      });

      const actualSha256 = paddedHexadecimalBytes.join("");

      const signatureDecoder = new TextDecoder();

      const signature = signatureDecoder.decode(bytes.slice(0, 5));

      return {
        ok: response.ok,
        size: bytes.byteLength,
        signature,
        expectedSha256: manifestEntry?.sha256,
        actualSha256,
      };
    },
    { path: pdfPath.replace(/^\/data\//u, ""), url: pdfUrl },
  );

  const fetchedPdfMatch = expect(fetchedPdf);

  await fetchedPdfMatch.toMatchObject({ ok: true, signature: "%PDF-" });

  const fetchedPdfSize = expect(fetchedPdf.size);

  await fetchedPdfSize.toBeGreaterThan(100_000);

  const fetchedPdfHash = expect(fetchedPdf.actualSha256);

  await fetchedPdfHash.toBe(fetchedPdf.expectedSha256);

  await page.waitForFunction(async (url) => {
    const cache = await caches.open("saberes-official-study-assets");

    return Boolean(await cache.match(url));
  }, pdfUrl);

  await context.setOffline(true);

  await page.goto("/questoes/2737");

  const openPdfPageButton = page.getByRole("button", { name: /Abrir página 3/ });

  await openPdfPageButton.click();

  const renderedPage = page.getByLabel(/Página 3 do documento/);

  const renderedPageVisibility = expect(renderedPage);

  await renderedPageVisibility.toBeVisible();

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

  const renderedWidth = expect(renderedPixels.width);

  await renderedWidth.toBeGreaterThan(0);

  const renderedHeight = expect(renderedPixels.height);

  await renderedHeight.toBeGreaterThan(0);

  const renderedContent = expect(renderedPixels.nonWhitePixels);

  await renderedContent.toBeGreaterThan(500);
});
