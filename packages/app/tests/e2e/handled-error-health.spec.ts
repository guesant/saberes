import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

test("erro do IndexedDB fica isolado no progresso e pode ser recuperado", async ({ page }) => {
  await page.addInitScript(() => {
    const originalOpen = indexedDB.open.bind(indexedDB);

    Object.defineProperty(indexedDB, "open", {
      configurable: true,
      value: (name: string, version?: number) => {
        if (localStorage.getItem("e2e-indexeddb-state") !== "available") {
          throw new DOMException("IndexedDB indisponível para o teste.", "InvalidStateError");
        }

        return originalOpen(name, version);
      },
    });
  });

  await page.goto("/meu-estudo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  const alert = page.getByRole("alert")
    .filter({ hasText: "Não foi possível carregar todo o seu progresso local." });

  await expect(alert)
    .toBeVisible();

  await expect(page.locator("#main-content"))
    .toBeVisible();

  await expect(page.getByRole("link", { name: "Catálogo" }))
    .toBeVisible();

  await page.evaluate(() => {
    localStorage.setItem("e2e-indexeddb-state", "available");
  });

  await alert.getByRole("button", { name: "Tentar novamente" })
    .click();

  await expect(alert)
    .toHaveCount(0);

  await expect(page.getByRole("heading", { name: "Estude com método." }))
    .toBeVisible();
});

test("erro do SQLite editorial fica isolado e a recarga recupera o catálogo", async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);

    Object.defineProperty(window, "fetch", {
      configurable: true,
      value: (input: RequestInfo | URL, init?: RequestInit) => {
        let url: string;

        if (typeof input === "string") {
          url = input;
        } else if (input instanceof URL) {
          url = input.href;
        } else {
          url = input.url;
        }

        if (url.includes("content.sqlite") && localStorage.getItem("e2e-content-database-state") !== "available") {
          return Promise.resolve(new Response(new Uint8Array([1, 2, 3]), { status: 200 }));
        }

        return originalFetch(input, init);
      },
    });
  });

  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  const alert = page.getByRole("alert")
    .filter({ hasText: "Não foi possível carregar o catálogo." });

  await expect(alert)
    .toBeVisible();

  await expect(page.locator("#main-content"))
    .toBeVisible();

  await expect(page.getByRole("link", { name: "Meu estudo" }))
    .toBeVisible();

  await page.evaluate(() => {
    localStorage.setItem("e2e-content-database-state", "available");
  });

  await page.reload({ waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByText("Filtrar catálogo", { exact: true })
    .click();

  await expect(alert)
    .toHaveCount(0);

  await expect(page.getByPlaceholder("Encontrar curso, mapa, plano ou conteúdo"))
    .toBeVisible();
});
