import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";

const base = process.env.VITE_BASE_PATH || "/";
const asset = (name: string) => `${base}${name}`.replace("//", "/");
const localContentPath = path.resolve(process.cwd(), ".local/content/content.sqlite");

const localContentPlugin = {
    name: "local-content-database",
    configureServer(server: {
        middlewares: {
            use: (
                route: string,
                handler: (
                    request: unknown,
                    response: {
                        statusCode: number;
                        setHeader: (name: string, value: string) => void;
                        end: (body?: string) => void;
                    },
                    next: (error?: unknown) => void,
                ) => void,
            ) => void;
        };
    }) {
        server.middlewares.use("/data/content.sqlite", (_request, response, next) => {
            if (!fs.existsSync(localContentPath)) {
                response.statusCode = 404;
                response.end("Banco de conteúdo local não encontrado.");
                return;
            }
            response.setHeader("Content-Type", "application/vnd.sqlite3");
            fs.createReadStream(localContentPath)
                .on("error", next)
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
            targets: [
                {
                    src: "../pkg-adapter-data-v1/node_modules/sql.js/dist/sql-wasm.wasm",
                    dest: ".",
                },
                {
                    src: "../../.cache/schema-docs/site/**/*",
                    dest: "-/backstage/database/schema",
                },
            ],
        }),
        VitePWA({
            registerType: "prompt",
            includeAssets: ["icons/*.svg"],
            manifest: {
                name: "Portal Guesant Saberes",
                short_name: "Saberes",
                description: "Estudos offline para processos seletivos e áreas de conhecimento.",
                lang: "pt-BR",
                theme_color: "#152a4a",
                background_color: "#f7f8fb",
                display: "standalone",
                start_url: base,
                icons: [
                    {
                        src: asset("icons/icon-192.svg"),
                        sizes: "192x192",
                        type: "image/svg+xml",
                    },
                    {
                        src: asset("icons/icon-512.svg"),
                        sizes: "512x512",
                        type: "image/svg+xml",
                    },
                ],
            },
            workbox: {
                navigateFallback: asset("index.html"),
                navigateFallbackDenylist: [/\/-\/backstage\/database\/schema(?:\/|$)/u],
                globPatterns: ["**/*.{js,css,html,svg,wasm,json}"],
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
        setupFiles: [new URL("../packages/app/src/test/setup.ts", import.meta.url).pathname],
        include: [
            "src/**/*.test.{ts,tsx}",
            "../pkg-core/src/**/*.test.{ts,tsx}",
            "../pkg-adapter-data-v1/src/**/*.test.{ts,tsx}",
        ],
        exclude: ["packages/app/tests/e2e/**", "**/node_modules/**"],
    },
});
