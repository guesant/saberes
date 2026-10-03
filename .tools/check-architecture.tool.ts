import { join, relative } from "@std/path";

const roots = {
  domain: join(Deno.cwd(), "packages/pkg-domain/src"),
  application: join(Deno.cwd(), "packages/pkg-application/src"),
  adapter: join(Deno.cwd(), "packages/pkg-adapter-data-v1/src"),
  ui: join(Deno.cwd(), "packages/pkg-ui/src"),
  app: join(Deno.cwd(), "packages/app/src"),
  tooling: join(Deno.cwd(), ".tools"),
  operators: join(Deno.cwd(), ".local/operator"),
};

const sourceExtensions = new Set([".ts", ".tsx"]);

const violations: string[] = [];

async function filesIn(directory: string): Promise<string[]> {
  const files: string[] = [];

  for await (const entry of Deno.readDir(directory)) {
    const path = join(directory, entry.name);

    if (entry.isDirectory) {
      files.push(...(await filesIn(path)));
    } else if (sourceExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      files.push(path);
    }
  }

  return files;
}

for (const [layer, root] of Object.entries(roots)) {
  for (const file of await filesIn(root)) {
    const relativePath = relative(root, file).replaceAll("\\", "/");

    const source = await Deno.readTextFile(file);

    const imports = [...source.matchAll(/(?:from|import\()\s*["']([^"']+)["']/g)].map(
      (match) => match[1],
    );

    const has = (pattern: RegExp) => imports.some((value) => pattern.test(value));

    const isTest = /\.(?:test|spec)\.tsx?$/u.test(relativePath);

    const isComposition =
      relativePath.startsWith("composition/") ||
      relativePath === "main.tsx" ||
      relativePath === "main.component.tsx";

    const isView =
      relativePath.endsWith("View.tsx") || /\.view\.component\.tsx$/u.test(relativePath);

    const isViewModel = /\.view-model\.ts$/u.test(relativePath);

    if (layer === "domain" && !isTest && imports.some((value) => !value.startsWith("."))) {
      violations.push(`${relativePath}: domain importa dependência externa`);
    }

    if (
      layer === "application" &&
      !isTest &&
      has(/react|mui|tanstack|vite|saberes-adapter-data-v1|sql\.js|dexie|ts-fsrs/)
    ) {
      violations.push(`${relativePath}: application importa UI, framework ou adapter`);
    }

    if (layer === "adapter" && has(/react|mui|react-router|@guesant\/saberes-app(?:\/|$)/)) {
      violations.push(`${relativePath}: adapter importa UI ou app`);
    }

    if (layer === "app" && !isComposition && has(/saberes-adapter-data-v1|sql\.js|dexie|ts-fsrs/)) {
      violations.push(`${relativePath}: somente composition pode montar adapters`);
    }

    if (
      layer === "app" &&
      relativePath.startsWith("features/") &&
      has(/saberes-adapter-data-v1|sql\.js|dexie|ts-fsrs/)
    ) {
      violations.push(`${relativePath}: feature acessa adapter diretamente`);
    }

    if (
      layer === "app" &&
      isView &&
      has(/AppDependenciesContext|AppServicesContext|saberes-adapter-data-v1|sql\.js|dexie|ts-fsrs/)
    ) {
      violations.push(`${relativePath}: View acessa infraestrutura/DI diretamente`);
    }

    if (
      layer === "app" &&
      relativePath.startsWith("features/") &&
      isViewModel &&
      has(/@mui\/|@emotion\/|react-router/)
    ) {
      violations.push(`${relativePath}: ViewModel importa dependência visual ou roteamento`);
    }
  }
}

if (violations.length) {
  console.error(violations.join("\n"));

  Deno.exitCode = 1;
} else {
  console.log(
    "Arquitetura válida: domínio, aplicação, adapters e apresentação respeitam as fronteiras.",
  );
}
