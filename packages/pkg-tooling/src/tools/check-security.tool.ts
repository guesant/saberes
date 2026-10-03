import { basename, extname, join, relative, resolve } from "@std/path";

const roots = [
  resolve(Deno.cwd(), "packages/app/src"),
  resolve(Deno.cwd(), "packages/pkg-core/src"),
  resolve(Deno.cwd(), "packages/pkg-adapter-data-v1/src"),
  resolve(Deno.cwd(), "packages/pkg-tooling/src"),
];

const extensions = new Set([".ts", ".tsx"]);

const forbiddenPatterns = [[/javascript\s*:/iu, "javascript URL"]];

export async function filesIn(directory) {
  const entries = [];

  for await (const entry of Deno.readDir(directory)) {
    entries.push(entry);
  }

  const files = [];

  for (const entry of entries) {
    const filePath = join(directory, entry.name);

    if (entry.isDirectory) {
      files.push(...(await filesIn(filePath)));
    } else if (entry.isFile && extensions.has(extname(entry.name))) {
      files.push(filePath);
    }
  }

  return files;
}

const violations = [];

for (const root of roots) {
  for (const filePath of await filesIn(root)) {
    if (basename(filePath) === "check-security.ts") {
      continue;
    }

    const source = await Deno.readTextFile(filePath);

    for (const [pattern, name] of forbiddenPatterns) {
      if (pattern.test(source)) {
        violations.push(`${relative(Deno.cwd(), filePath)}: ${name}`);
      }
    }
  }
}

if (violations.length) {
  console.error(violations.join("\n"));

  Deno.exitCode = 1;
} else {
  console.log("Security check válido: nenhuma API de execução ou HTML inseguro foi encontrado.");
}
