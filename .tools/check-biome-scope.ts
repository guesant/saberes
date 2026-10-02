const sourceExtensions = new Set([".cjs", ".mjs", ".ts", ".tsx"]);
const ignoredDirectories = new Set([
    ".git",
    ".cache",
    "coverage",
    "dist",
    "node_modules",
]);
const roots = ["packages", ".tools"];
const suppressionMarker = ["biome", "ignore"].join("-");

async function collectSourceFiles(root: string): Promise<string[]> {
    const files: string[] = [];
    const directory = `${Deno.cwd()}/${root}`;

    async function visit(path: string) {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory && ignoredDirectories.has(entry.name))
                continue;
            if (entry.name === ".biomeignore") {
                throw new Error(
                    `${path}/${entry.name} is not allowed: it could hide source files from Biome.`,
                );
            }

            const child = `${path}/${entry.name}`;
            if (entry.isDirectory) {
                await visit(child);
                continue;
            }

            const extension = entry.name.slice(entry.name.lastIndexOf("."));
            if (entry.isFile && sourceExtensions.has(extension)) {
                const relativePath = child.slice(Deno.cwd().length + 1);
                const source = await Deno.readTextFile(child);
                if (source.includes(suppressionMarker)) {
                    throw new Error(
                        `${relativePath} contains a Biome suppression; fix the rule or document an explicit exception outside the source tree.`,
                    );
                }
                files.push(relativePath);
            }
        }
    }

    await visit(directory);
    return files.sort();
}

function assert(condition: boolean, message: string) {
    if (!condition) throw new Error(message);
}

const files = (await Promise.all(roots.map(collectSourceFiles))).flat().sort();
assert(
    files.length > 0,
    "Biome scope is empty: no source files were discovered.",
);

for (const root of roots) {
    const ignoreFile = `${root}/.biomeignore`;
    try {
        await Deno.stat(ignoreFile);
        throw new Error(
            `${ignoreFile} is not allowed: it could hide source files from Biome.`,
        );
    } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) throw error;
    }
}

for (const file of [".biomeignore", ".config/.biomeignore"]) {
    try {
        await Deno.stat(file);
        throw new Error(
            `${file} is not allowed: it could hide source files from Biome.`,
        );
    } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) throw error;
    }
}

const biomeConfig = JSON.parse(
    await Deno.readTextFile(".config/biome.json"),
) as {
    linter?: { rules?: Record<string, Record<string, unknown>> };
    files?: { includes?: string[]; ignore?: string[] };
};
assert(
    !biomeConfig.files,
    ".config/biome.json must not define a restrictive files filter; the explicit quality command is the scope boundary.",
);
const requiredRules = {
    correctness: ["noUnusedImports", "noUnusedVariables"],
    performance: ["noNamespaceImport"],
    style: [
        "noCommonJs",
        "noNestedTernary",
        "noParameterAssign",
        "useConst",
        "useDefaultParameterLast",
        "useExponentiationOperator",
        "useThrowNewError",
        "useThrowOnlyError",
    ],
};
for (const [group, rules] of Object.entries(requiredRules)) {
    for (const rule of rules) {
        assert(
            biomeConfig.linter?.rules?.[group]?.[rule] !== undefined,
            `Airbnb-compatible Biome rule is missing: ${group}.${rule}.`,
        );
    }
}

const denoConfig = JSON.parse(await Deno.readTextFile("deno.json")) as {
    tasks?: Record<string, string>;
};
for (const task of ["check:format", "check:lint"]) {
    assert(
        denoConfig.tasks?.[task]?.includes("packages .tools"),
        `deno task ${task} must include both packages and .tools in its Biome scope.`,
    );
}

console.log(
    `Biome scope: ${files.length} source files in packages/ and .tools/`,
);
