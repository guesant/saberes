const roots = [
    ".config",
    ".container",
    ".github",
    "docs",
    "packages",
    "README.md",
    "deno.json",
    "justfile",
    "package.json",
];
const ignoredDirectories = new Set([".git", ".cache", ".local", "dist", "node_modules"]);
const textExtensions = new Set([
    ".css",
    ".hcl",
    ".json",
    ".jsonc",
    ".md",
    ".sql",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".yml",
    ".yaml",
]);
const forbidden = [
    /REPLACE_WITH_[A-Z0-9_]+/g,
    /(?:change[-_]?me|changeme)/gi,
    /[a-z0-9-]+\.invalid(?:[^a-z0-9-]|$)/gi,
    /sha-0{40}/gi,
];

function assert(condition: boolean, message: string) {
    if (!condition) throw new Error(message);
}

async function scan(filePath: string, allFindings: string[]) {
    const info = await Deno.stat(filePath);
    if (info.isFile) {
        const extension = filePath.slice(filePath.lastIndexOf("."));
        if (!textExtensions.has(extension) && !["README.md", "justfile"].includes(filePath)) return;
        const source = await Deno.readTextFile(filePath);
        for (const pattern of forbidden) {
            for (const match of source.matchAll(pattern)) {
                const line = source.slice(0, match.index ?? 0).split("\n").length;
                allFindings.push(`${filePath}:${line} contains ${match[0]}`);
            }
        }
        return;
    }
    if (!info.isDirectory) return;
    for await (const entry of Deno.readDir(filePath)) {
        if (entry.isDirectory && ignoredDirectories.has(entry.name)) continue;
        await scan(`${filePath}/${entry.name}`, allFindings);
    }
}

const findings: string[] = [];
for (const root of roots) {
    try {
        await scan(root, findings);
    } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) throw error;
    }
}
assert(findings.length === 0, `Placeholder gate failed:\n${findings.join("\n")}`);
console.log("Placeholder gate passed.");
