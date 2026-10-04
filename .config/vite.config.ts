import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { defineConfig } from "vitest/config";

const base = process.env.VITE_BASE_PATH || "/";

export const asset = (name: string) => `${base}${name}`.replace("//", "/");

const localContentPath = path.resolve(process.cwd(), ".local/content/content.sqlite");

const schemaDocsPath = path.resolve(process.cwd(), ".cache/schema-docs/site");

const sqlWasmPath = path.resolve(process.cwd(), "node_modules/sql.js/dist/sql-wasm.wasm");

const staticCopyTargets = [
  ...(fs.existsSync(localContentPath)
    ? [
        {
          src: localContentPath,
          dest: "data",
        },
      ]
    : []),
  {
    src: sqlWasmPath,
    dest: ".",
  },
  ...(fs.existsSync(schemaDocsPath)
    ? [
        {
          src: `${schemaDocsPath}/**/*`,
          dest: "-/backstage/database/schema",
        },
      ]
    : []),
];

type ViteResponse = {
  statusCode: number;
  setHeader(headerName: string, value: string): void;

  end(body?: string): void;
};

type ViteMiddlewareNext = (error?: unknown) => void;

type ViteMiddlewareHandler = (
  request: unknown,
  response: ViteResponse,
  next: ViteMiddlewareNext,
) => void;

type ViteMiddlewareUse = (route: string, handler: ViteMiddlewareHandler) => void;

interface ViteMiddlewares {
  use: ViteMiddlewareUse;
}

interface ViteServer {
  middlewares: ViteMiddlewares;
}

const localContentPlugin = {
  name: "local-content-database",
  configureServer(server: ViteServer) {
    server.middlewares.use("/data/content.sqlite", (_request, response, next) => {
      if (!fs.existsSync(localContentPath)) {
        response.statusCode = 404;

        response.end("Banco de conteúdo local não encontrado.");

        return;
      }

      response.setHeader("Content-Type", "application/vnd.sqlite3");

      fs.createReadStream(localContentPath)
        .on("error", next)
        // awkward-type-ignore: the local Vite response adapter exposes a compatible writable stream at runtime
        .pipe(response as never);
    });
  },
};

export default defineConfig({
  root: "packages/app",
  plugins: [
    react(),
    localContentPlugin,
    viteStaticCopy({
      targets: staticCopyTargets,
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.svg"],
      manifest: {
        id: base,
        name: "Saberes",
        short_name: "Saberes",
        description: "Estudos offline para processos seletivos e áreas de conhecimento.",
        lang: "pt-BR",
        dir: "ltr",
        theme_color: "#152a4a",
        background_color: "#f7f8fb",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
        orientation: "any",
        scope: base,
        start_url: base,
        categories: ["education", "productivity"],
        prefer_related_applications: false,
        launch_handler: { client_mode: "navigate-existing" },
        shortcuts: [
          {
            name: "Catálogo",
            short_name: "Catálogo",
            description: "Explorar cursos, aulas e questões.",
            url: `${base}catalogo`,
            icons: [{ src: asset("icons/icon-192.svg"), sizes: "192x192", type: "image/svg+xml" }],
          },
          {
            name: "Meu estudo",
            short_name: "Meu estudo",
            description: "Continuar a atividade atual.",
            url: `${base}meu-estudo`,
            icons: [{ src: asset("icons/icon-192.svg"), sizes: "192x192", type: "image/svg+xml" }],
          },
          {
            name: "Revisões",
            short_name: "Revisões",
            description: "Revisar conteúdos pendentes.",
            url: `${base}revisoes`,
            icons: [{ src: asset("icons/icon-192.svg"), sizes: "192x192", type: "image/svg+xml" }],
          },
        ],
        icons: [
          {
            src: asset("icons/icon-192.svg"),
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: asset("icons/icon-512.svg"),
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        cacheId: "saberes",
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: asset("index.html"),
        navigateFallbackDenylist: [/\/-\/backstage\/database\/schema(?:\/|$)/u],
        globPatterns: ["**/*.{js,css,html,svg,wasm,json,sqlite}"],
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.hostname === "raw.githubusercontent.com",
            handler: "CacheFirst",
            options: {
              cacheName: "saberes-external-content",
              expiration: { maxEntries: 3 },
            },
          },
        ],
      },
    }),
  ],
  base,
  build: { outDir: "../../dist", emptyOutDir: true },
  server: { host: "0.0.0.0", port: 5173 },
  test: {
    environment: "jsdom",
    setupFiles: [
      new URL("../packages/app/src/test/setup.test-support.ts", import.meta.url).pathname,
    ],
    include: [
      "src/**/*.test.{ts,tsx}",
      "../pkg-domain/src/**/*.test.{ts,tsx}",
      "../pkg-application/src/**/*.test.{ts,tsx}",
      "../pkg-adapter-data-v1/src/**/*.test.{ts,tsx}",
      "../pkg-adapter-validation-v1/src/**/*.test.{ts,tsx}",
      "../pkg-adapter-graphology-v1/src/**/*.test.{ts,tsx}",
      "../pkg-ui-content/src/**/*.test.{ts,tsx}",
    ],
    exclude: ["packages/app/tests/e2e/**", "**/node_modules/**"],
  },
});
