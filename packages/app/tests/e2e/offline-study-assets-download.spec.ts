import { expect, test } from "@playwright/test";

declare global {
    interface Window {
        __offlineDownloadFixture: {
            getPdfAttempts: () => number;
            pdfUrl: string;
            pdfFixture: string;
        };
    }
}

test.use({ serviceWorkers: "block" });

test("download de PDF se recupera de falha de rede após retry e usa cache isolado", async ({
    page,
}) => {
    await page.route("**/__e2e/offline-assets-harness", async (route) => {
        await route.fulfill({
            contentType: "text/html",
            body: `<!doctype html>
        <html lang="pt-BR">
          <body>
            <output id="download-state" data-status="preparing"></output>
            <button id="retry-download" hidden>Tentar novamente</button>
            <script type="module">
              import { runOfflineStudyAssetsDownload } from "/src/run-offline-study-assets-download.function.ts";

              const pdfUrl = new URL("/data/official-pdfs/e2e-retry-fixture.pdf", window.location.origin).href;
              const pdfFixture = "%PDF-1.4\\n% Playwright in-memory fixture\\n";
              const pdfBytes = new TextEncoder().encode(pdfFixture).byteLength;
              const manifest = JSON.stringify({
                appUrlSuffix: "data/official-pdfs/e2e-retry-fixture.pdf",
                bytes: pdfBytes,
                mediaType: "application/pdf",
                path: "official-pdfs/e2e-retry-fixture.pdf",
              });

              let pdfAttempts = 0;
              let state = {
                completedAssets: 0,
                completedBytes: 0,
                failedAssets: 0,
                quotaExceeded: false,
                totalAssets: 0,
                totalBytes: 0,
                error: null,
                status: "preparing",
              };

              const output = document.querySelector("#download-state");
              const retryButton = document.querySelector("#retry-download");

              const renderState = () => {
                output.dataset.status = state.status;
                output.dataset.failedAssets = String(state.failedAssets);
                output.dataset.completedAssets = String(state.completedAssets);
                output.textContent = state.error || state.status;
                retryButton.hidden = state.status !== "error";
              };

              const setState = (next) => {
                state = typeof next === "function" ? next(state) : next;
                renderState();
              };

              const originalFetch = window.fetch.bind(window);

              window.fetch = async (input, init) => {
                const url = String(input);

                if (url.endsWith("/data/asset-manifest.jsonl")) {
                  return new Response(manifest, {
                    headers: { "Content-Type": "application/x-ndjson" },
                  });
                }

                if (url === pdfUrl) {
                  pdfAttempts += 1;

                  if (pdfAttempts === 1) {
                    throw new TypeError("Failed to fetch");
                  }

                  return new Response(pdfFixture, {
                    headers: { "Content-Type": "application/pdf" },
                  });
                }

                return originalFetch(input, init);
              };

              const startDownload = () => {
                return runOfflineStudyAssetsDownload({
                  controller: new AbortController(),
                  setState,
                });
              };

              retryButton.addEventListener("click", () => { void startDownload(); });
              renderState();
              void startDownload();

              window.__offlineDownloadFixture = {
                getPdfAttempts: () => pdfAttempts,
                pdfUrl,
                pdfFixture,
              };
            </script>
          </body>
        </html>`,
        });
    });

    await page.goto("/__e2e/offline-assets-harness");

    const state = page.locator("#download-state");
    const retryButton = page.getByRole("button", { name: "Tentar novamente" });

    await expect(state).toHaveAttribute("data-status", "error");
    await expect(state).toHaveAttribute("data-failed-assets", "1");
    await expect(state).toContainText("Verifique a conexão e tente novamente");
    await expect(retryButton).toBeVisible();

    await retryButton.click();

    await expect(state).toHaveAttribute("data-status", "complete");
    await expect(state).toHaveAttribute("data-completed-assets", "1");
    await expect(retryButton).toBeHidden();

    await page.context().setOffline(true);

    const cachedFixture = await page.evaluate(async () => {
        const fixture = window.__offlineDownloadFixture;
        const response = await caches
            .open("saberes-official-study-assets")
            .then((cache) => {
                return cache.match(fixture.pdfUrl);
            });

        return {
            attempts: fixture.getPdfAttempts(),
            body: response ? await response.text() : null,
        };
    });

    expect(cachedFixture.attempts).toBe(2);
    expect(cachedFixture.body).toBe(
        "%PDF-1.4\n% Playwright in-memory fixture\n",
    );
});
