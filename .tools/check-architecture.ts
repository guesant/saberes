import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const roots = {
    core: join(process.cwd(), "packages/pkg-core/src"),
    adapter: join(process.cwd(), "packages/pkg-adapter-data-v1/src"),
    app: join(process.cwd(), "packages/app/src"),
};
const sourceExtensions = new Set([".ts", ".tsx"]);
const violations = [];

async function filesIn(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) files.push(...(await filesIn(path)));
        else if (
            sourceExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")))
        )
            files.push(path);
    }
    return files;
}

for (const [layer, root] of Object.entries(roots)) {
    for (const file of await filesIn(root)) {
        const relativePath = relative(root, file).replaceAll("\\", "/");
        const source = await readFile(file, "utf8");
        const imports = [
            ...source.matchAll(/(?:from|import\()\s*["']([^"']+)["']/g),
        ].map((match) => match[1]);
        const has = (pattern) => imports.some((value) => pattern.test(value));
        if (layer === "core" && imports.some((value) => !value.startsWith(".")))
            violations.push(
                `${relativePath}: core importa dependência externa`,
            );
        if (
            layer === "adapter" &&
            has(/react|mui|react-router|@guesant\/saberes-app/)
        )
            violations.push(`${relativePath}: adapter importa UI ou app`);
        if (
            layer === "app" &&
            relativePath.startsWith("features/") &&
            has(/saberes-adapter-data-v1|sql\.js|dexie|ts-fsrs/)
        )
            violations.push(
                `${relativePath}: feature acessa adapter diretamente`,
            );
        if (
            layer === "app" &&
            relativePath.endsWith("View.tsx") &&
            has(
                /AppDependenciesContext|AppServicesContext|saberes-adapter-data-v1|sql\.js|dexie|ts-fsrs/,
            )
        )
            violations.push(
                `${relativePath}: View acessa infraestrutura/DI diretamente; use o ViewModel`,
            );
        if (
            layer === "app" &&
            relativePath.startsWith("features/") &&
            !relativePath.endsWith("View.tsx") &&
            has(/@mui\/|@emotion\/|react-router/)
        )
            violations.push(
                `${relativePath}: ViewModel importa dependência visual ou de roteamento`,
            );
    }
}

if (violations.length) {
    console.error(violations.join("\n"));
    process.exitCode = 1;
} else {
    console.log(
        "Arquitetura válida: camadas novas sem dependências proibidas.",
    );
}
