import { join, resolve } from "@std/path";

const root = resolve(Deno.cwd(), "dist");

const schemaDocsSource = join(Deno.cwd(), ".cache/schema-docs/site/index.html");

let hasSchemaDocs = false;

try {
  await Deno.stat(schemaDocsSource);

  hasSchemaDocs = true;
} catch (error) {
  if (!(error instanceof Deno.errors.NotFound)) {
    throw error;
  }
}

const requiredFiles = [
  "index.html",
  "manifest.webmanifest",
  "sw.js",
  "sql-wasm.wasm",
  ...(hasSchemaDocs ? ["-/backstage/database/schema/index.html"] : []),
];

for (const relativePath of requiredFiles) {
  const filePath = join(root, relativePath);

  try {
    await Deno.stat(filePath);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }

    throw new Error(`Build incompleto: arquivo ausente em dist/${relativePath}`);
  }
}

const index = await Deno.readTextFile(join(root, "index.html"));

if (!/<div id="root">/.test(index) && !/<div id="root"><\/div>/.test(index)) {
  throw new Error("Build inválido: o ponto de montagem React não foi encontrado.");
}

const manifest = JSON.parse(await Deno.readTextFile(join(root, "manifest.webmanifest")));

if (
  !manifest.name ||
  !manifest.start_url ||
  !Array.isArray(manifest.icons) ||
  !manifest.icons.length
) {
  throw new Error("Build inválido: manifest PWA incompleto.");
}

console.info(
  `Build válido: ${requiredFiles.length} artefatos essenciais e manifest PWA verificados.`,
);
