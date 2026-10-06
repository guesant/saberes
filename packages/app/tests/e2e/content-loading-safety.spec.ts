import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

test("falha de rede do conteúdo mostra erro e permite tentar novamente", async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);

    Object.defineProperty(window, "fetch", {
      configurable: true,
      value: (input: RequestInfo | URL, init?: RequestInit) => {
        if (String(input)
          .includes("content.sqlite") && localStorage.getItem("e2e-content-ready") !== "true") {
          return Promise.reject(new TypeError("Failed to fetch"));
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

  await expect(page.getByRole("link", { name: "Meu estudo" }))
    .toBeVisible();

  await page.evaluate(() => {
    localStorage.setItem("e2e-content-ready", "true");
  });

  await alert.getByRole("button", { name: "Tentar novamente" })
    .click();

  await validateRouteSettled(page);

  await expect(alert)
    .toHaveCount(0);
});

test("HTML recebido do cache ou do servidor não vira conteúdo sintético", async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);

    Object.defineProperty(window, "fetch", {
      configurable: true,
      value: (input: RequestInfo | URL, init?: RequestInit) => {
        if (String(input)
          .includes("content.sqlite")) {
          return Promise.resolve(new Response("<!doctype html><html>Saberes</html>", {
            status: 200,
            headers: { "Content-Type": "text/html" },
          }));
        }

        return originalFetch(input, init);
      },
    });
  });

  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.getByRole("alert")
    .filter({ hasText: "Não foi possível carregar o catálogo." }))
    .toBeVisible();

  await expect(page.locator("#main-content"))
    .toBeVisible();
});

test("asset WASM indisponível termina no erro localizado de conteúdo", async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);

    Object.defineProperty(window, "fetch", {
      configurable: true,
      value: (input: RequestInfo | URL, init?: RequestInit) => {
        if (String(input)
          .includes("sql-wasm.wasm")) {
          return Promise.resolve(new Response("", { status: 503 }));
        }

        return originalFetch(input, init);
      },
    });
  });

  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.getByRole("alert")
    .filter({ hasText: "Não foi possível carregar o catálogo." }))
    .toBeVisible();

  await expect(page.getByRole("link", { name: "Meu estudo" }))
    .toBeVisible();
});

test("fetch sem resposta sai do carregamento após o limite de tempo", async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);

    const originalSetTimeout = window.setTimeout.bind(window);

    Object.defineProperty(window, "setTimeout", {
      configurable: true,
      value: (handler: TimerHandler, timeout?: number, ...arguments_: unknown[]) => {
        if (timeout === 15_000) {
          return originalSetTimeout(handler, 20, ...arguments_);
        }

        return originalSetTimeout(handler, timeout, ...arguments_);
      },
    });

    Object.defineProperty(window, "fetch", {
      configurable: true,
      value: (input: RequestInfo | URL, init?: RequestInit) => {
        if (String(input)
          .includes("content.sqlite")) {
          return new Promise<Response>(() => {});
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

  await alert.getByText("Ver detalhes técnicos", { exact: true })
    .click();

  await expect(alert.getByText(/O conteúdo demorou demais para carregar/u))
    .toBeVisible();
});

test("cache PWA preserva o conteúdo real em uma recarga offline", async ({ page, context }) => {
  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  await expect.poll(() => {
    return page.evaluate(() => {
      return Boolean(navigator.serviceWorker.controller);
    });
  })
    .toBe(true);

  await context.setOffline(true);

  await page.reload({ waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.getByRole("alert")
    .filter({ hasText: "Não foi possível carregar o catálogo." }))
    .toHaveCount(0);

  await expect(page.getByText("Filtrar catálogo", { exact: true }))
    .toBeVisible();
});

test("SQLite substituído por HTML no cache PWA apresenta erro de conteúdo", async ({ page }) => {
  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  await expect.poll(() => {
    return page.evaluate(() => {
      return Boolean(navigator.serviceWorker.controller);
    });
  })
    .toBe(true);

  const corruptedEntries = await page.evaluate(async () => {
    const cacheNames = await caches.keys();

    const replacements = await Promise.all(cacheNames.map(async (cacheName) => {
      const cache = await caches.open(cacheName);

      const requests = await cache.keys();

      const databases = requests.filter((request) => {
        return request.url.includes("content.sqlite");
      });

      await Promise.all(databases.map((request) => {
        return cache.put(request, new Response("<!doctype html><html>Saberes</html>"));
      }));

      return databases.length;
    }));

    return replacements.reduce((sum, count) => {
      return sum + count;
    }, 0);
  });

  expect(corruptedEntries)
    .toBeGreaterThan(0);

  await page.reload({ waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.getByRole("alert")
    .filter({ hasText: "Não foi possível carregar o catálogo." }))
    .toBeVisible();
});
