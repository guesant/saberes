import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "dist");
const requiredFiles = ["index.html", "manifest.webmanifest", "sw.js", "sql-wasm.wasm"];

for (const relativePath of requiredFiles) {
    const filePath = path.join(root, relativePath);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Build incompleto: arquivo ausente em dist/${relativePath}`);
    }
}

const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!index.includes('<div id="root">') && !index.includes('<div id="root"></div>')) {
    throw new Error("Build inválido: o ponto de montagem React não foi encontrado.");
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
if (
    !manifest.name ||
    !manifest.start_url ||
    !Array.isArray(manifest.icons) ||
    !manifest.icons.length
) {
    throw new Error("Build inválido: manifest PWA incompleto.");
}

console.log(
    `Build válido: ${requiredFiles.length} artefatos essenciais e manifest PWA verificados.`,
);
