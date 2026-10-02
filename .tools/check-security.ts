import fs from "node:fs/promises";
import path from "node:path";

const roots = [
    path.resolve(process.cwd(), "packages/app/src"),
    path.resolve(process.cwd(), "packages/pkg-core/src"),
    path.resolve(process.cwd(), "packages/pkg-adapter-data-v1/src"),
    path.resolve(process.cwd(), ".tools"),
];
const extensions = new Set([".ts", ".tsx"]);
const forbiddenPatterns = [
    [/\beval\s*\(/u, "eval"],
    [/\bnew\s+Function\s*\(/u, "new Function"],
    [/dangerouslySetInnerHTML/u, "dangerouslySetInnerHTML"],
    [/\.innerHTML\s*=/u, "innerHTML assignment"],
    [/javascript\s*:/iu, "javascript URL"],
];

async function filesIn(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const filePath = path.join(directory, entry.name);
        if (entry.isDirectory()) files.push(...(await filesIn(filePath)));
        else if (extensions.has(path.extname(entry.name))) files.push(filePath);
    }
    return files;
}

const violations = [];
for (const root of roots) {
    for (const filePath of await filesIn(root)) {
        if (path.basename(filePath) === "check-security.ts") continue;
        const source = await fs.readFile(filePath, "utf8");
        for (const [pattern, name] of forbiddenPatterns) {
            if (pattern.test(source))
                violations.push(`${path.relative(process.cwd(), filePath)}: ${name}`);
        }
    }
}

if (violations.length) {
    console.error(violations.join("\n"));
    process.exitCode = 1;
} else {
    console.log("Security check válido: nenhuma API de execução ou HTML inseguro foi encontrado.");
}
