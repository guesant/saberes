import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { defineConfig } from "vitest/config";

const base = process.env.VITE_BASE_PATH || "/";

const escapedBase = base.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");

const officialStudyAssetUrlPattern = new RegExp(
  `${escapedBase}data/[^?#]+\\.(?:pdf|png|jpe?g)(?:\\?[^#]*)?$`,
  "iu",
);

const officialStudyAssetsCacheName = "saberes-official-study-assets";

const appRequire = createRequire(path.resolve(process.cwd(), "packages/app/package.json"));

const testingLibraryReactPath = appRequire.resolve("@testing-library/react");

export const asset = (name: string) => {
  return `${base}${name}`.replace("//", "/");
};

const localContentPath = path.resolve(process.cwd(), ".local/content/content.sqlite");

const localContentAssetsPath = path.resolve(
  process.cwd(),
  ".local/content/staging/unicamp-2027-v1/offline-assets-2026-2027/data",
);

const localContentAssetsManifestPath = path.resolve(
  process.cwd(),
  ".local/content/staging/unicamp-2027-v1/offline-assets-2026-2027/asset-manifest.jsonl",
);

interface LocalContentAssetManifestRecord {
  path: string;
}

const localContentAssetTargets = fs.existsSync(localContentAssetsManifestPath)
  ? [
    ...new Set(
      fs
        .readFileSync(localContentAssetsManifestPath, "utf8")
        .trim()
        .split("\n")
        .map((line) => {
          const record = JSON.parse(line) as LocalContentAssetManifestRecord;

          return path.posix.dirname(record.path);
        }),
    ),
  ].map((directory) => {return {
    src: `${localContentAssetsPath}/${directory}/*`,
    dest: `data/${directory}`,
  };})
  : [];

const localContentAssetPaths = new Set(
  fs.existsSync(localContentAssetsManifestPath)
    ? fs
      .readFileSync(localContentAssetsManifestPath, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => {return (JSON.parse(line) as LocalContentAssetManifestRecord).path;})
    : [],
);

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
  ...(fs.existsSync(localContentAssetsManifestPath)
    ? [{ src: localContentAssetsManifestPath, dest: "data" }]
    : []),
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

interface LocalContentRequest {
  url?: string;
}

type ViteMiddlewareUse = (route: string, handler: ViteMiddlewareHandler) => void;

interface ViteMiddlewares {
  use: ViteMiddlewareUse;
}

interface ViteServer {
  middlewares: ViteMiddlewares;
}

interface MediaTypeByExtension {
  [extension: string]: string;
}

const localContentPlugin = {
  name: "local-content-database",
  configureServer(server: ViteServer) {
    server.middlewares.use("/data/asset-manifest.jsonl", (_request, response, next) => {
      if (!fs.existsSync(localContentAssetsManifestPath)) {
        response.statusCode = 404;

        response.end("Manifesto de conteúdo local não encontrado.");

        return;
      }

      response.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");

      fs.createReadStream(localContentAssetsManifestPath)
        .on("error", next)
        // awkward-type-ignore: the local Vite response adapter exposes a compatible writable stream at runtime
        .pipe(response as never);
    });

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

    server.middlewares.use("/data", (request, response, next) => {
      const requestUrl = (request as LocalContentRequest).url;

      if (!requestUrl) {
        response.statusCode = 404;

        response.end("Asset local não encontrado.");

        return;
      }

      let relativePath: string;

      try {
        relativePath = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname)
          .replace(/^\/+/, "");
      } catch {
        response.statusCode = 400;

        response.end("Caminho de asset inválido.");

        return;
      }

      const assetPath = path.resolve(localContentAssetsPath, relativePath);

      const assetRelativePath = path.relative(localContentAssetsPath, assetPath);

      if (
        !relativePath ||
        assetRelativePath.startsWith("..") ||
        path.isAbsolute(assetRelativePath) ||
        !localContentAssetPaths.has(relativePath) ||
        !fs.existsSync(assetPath) ||
        !fs
          .statSync(assetPath)
          .isFile()
      ) {
        response.statusCode = 404;

        response.end("Asset local não encontrado.");

        return;
      }

      const extension = path.extname(assetPath)
        .toLowerCase();

      const mediaTypes: MediaTypeByExtension = {
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".webp": "image/webp",
      };

      response.setHeader("Content-Type", mediaTypes[extension] ?? "application/octet-stream");

      response.setHeader("Cache-Control", "no-cache");

      fs.createReadStream(assetPath)
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
    ...(localContentAssetTargets.length > 0
      ? [
        viteStaticCopy({
          targets: localContentAssetTargets,
        }),
      ]
      : []),
    VitePWA({
      registerType: "prompt",
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
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        globIgnores: ["-/backstage/database/schema/**"],
        navigateFallback: asset("index.html"),
        navigateFallbackDenylist: [/\/-\/backstage\/database\/schema(?:\/|$)/u],
        globPatterns: ["**/*.{js,mjs,css,html,svg,wasm,json,jsonl,sqlite}"],
        skipWaiting: false,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.hostname === "raw.githubusercontent.com";
            },
            handler: "CacheFirst",
            options: {
              cacheName: "saberes-external-content",
              expiration: { maxEntries: 3 },
            },
          },
          {
            urlPattern: officialStudyAssetUrlPattern,
            handler: "CacheFirst",
            options: {
              cacheName: officialStudyAssetsCacheName,
              expiration: {
                maxEntries: 256,
                maxAgeSeconds: 60 * 60 * 24 * 365,
                purgeOnQuotaError: true,
              },
            },
          },
        ],
      },
    }),
  ],
  base,
  resolve: {
    alias: [{ find: "@testing-library/react", replacement: testingLibraryReactPath }],
  },
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
      "../pkg-ui/src/**/*.test.{ts,tsx}",
      "../pkg-ui-content/src/**/*.test.{ts,tsx}",
    ],
    exclude: ["packages/app/tests/e2e/**", "**/node_modules/**"],
  },
});
