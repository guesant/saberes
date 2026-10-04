const roots = ["packages", ".local/operator"];

const sourceExtensionPattern = /\.(?:ts|tsx)$/;

const fileNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*\.(?:ts|tsx)$/;

const typeSuffixes = new Set([
  "adapter",
  "adapters",
  "command-handler",
  "component",
  "contract",
  "composition",
  "config",
  "database",
  "declaration",
  "hooks",
  "hook",
  "interface",
  "locale",
  "model",
  "models",
  "enums",
  "port",
  "ports",
  "query-handler",
  "repository",
  "schema",
  "schemas",
  "service",
  "services",
  "setup",
  "spec",
  "storage",
  "store",
  "styles",
  "test",
  "test-support",
  "type",
  "use-case",
  "use-cases",
  "view-model",
  "types",
  "function",
  "tool",
  "operator",
]);

const errors: string[] = [];

export async function collectFiles(directory: string): Promise<string[]> {
  const files: string[] = [];

  for await (const entry of Deno.readDir(directory)) {
    const path = `${directory}/${entry.name}`;

    if (entry.isDirectory) {
      files.push(...(await collectFiles(path)));

      continue;
    }

    if (entry.isFile && sourceExtensionPattern.test(entry.name)) {
      files.push(path);
    }
  }

  return files;
}

export function getFinalType(fileName: string): string | null {
  if (fileName.endsWith(".d.ts")) {
    return "declaration";
  }

  const segments = fileName.split(".");

  const type = segments.at(-2);

  return type && typeSuffixes.has(type) ? type : null;
}

export function checkFileName(path: string): void {
  const fileName = path.split("/")
    .at(-1) ?? path;

  if (fileName === "index.ts" || fileName === "index.tsx") {
    return;
  }

  if (!fileNamePattern.test(fileName)) {
    errors.push(`${path}: use small-kebab-case.type.ts[x]`);

    return;
  }

  const type = getFinalType(fileName);

  if (!type) {
    errors.push(`${path}: missing a recognized file type suffix`);
  }

  if (fileName.endsWith(".tsx")) {
    const isComponent = type === "component";

    const isComponentTest = type === "test" && fileName.includes(".component.test.");

    if (!isComponent && !isComponentTest) {
      errors.push(`${path}: JSX files must be component.tsx or component.test.tsx`);
    }
  }

  if (path.includes("/pkg-application/src/use-cases/") && type === "use-case") {
    const source = Deno.readTextFileSync(path);

    const classes = source.match(/\bclass\s+[A-Za-z_$][\w$]*/g) ?? [];

    if (classes.length !== 1) {
      errors.push(`${path}: each CQRS use case must contain exactly one class`);
    }
  }
}

let fileCount = 0;

for (const root of roots) {
  const rootInfo = await Deno.stat(root)
    .catch((error: unknown) => {
      if (error instanceof Deno.errors.NotFound) {
        return null;
      }

      throw error;
    });

  if (!rootInfo?.isDirectory) {
    continue;
  }

  for (const path of await collectFiles(root)) {
    fileCount += 1;

    checkFileName(path);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));

  Deno.exit(1);
}

console.info(`File convention check passed for ${fileCount} files.`);
