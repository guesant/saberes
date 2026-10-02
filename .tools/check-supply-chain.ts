import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const entry of fs.readdirSync(path.join(root, ".tools"), {
    withFileTypes: true,
})) {
    if (entry.isFile() && /\.(?:mjs|cjs|js)$/u.test(entry.name)) {
        failures.push(`.tools/${entry.name}: scripts de automação devem usar TypeScript/Deno`);
    }
}

const read = (relativePath) => {
    const filePath = path.join(root, relativePath);
    if (!fs.existsSync(filePath)) {
        failures.push(`${relativePath}: arquivo obrigatório ausente`);
        return "";
    }
    return fs.readFileSync(filePath, "utf8");
};

const assertIncludes = (relativePath, content, expected) => {
    if (!content.includes(expected)) {
        failures.push(`${relativePath}: referência obrigatória ausente: ${expected}`);
    }
};

for (const lockfile of ["package.json", "deno.json", "deno.lock"]) {
    read(lockfile);
}
read("biome.json");
const packageManifest = read("package.json");
const denoConfig = read("deno.json");
assertIncludes("package.json", packageManifest, '"sql-formatter"');
assertIncludes("deno.json", denoConfig, '"db:format"');
assertIncludes("deno.json", denoConfig, '"db:format:check"');

const dockerfiles = [".container/Dockerfile"];
for (const relativePath of dockerfiles) {
    const content = read(relativePath);
    const stageNames = new Set(
        [...content.matchAll(/^FROM\s+\S+\s+AS\s+(\S+)/gim)].map(([, name]) => name),
    );
    const pinnedArgs = new Set(
        [...content.matchAll(/^ARG\s+([A-Z0-9_]+)=(.*)$/gm)]
            .filter(([, , value]) => value.includes("@sha256:"))
            .map(([, name]) => name),
    );

    for (const line of content.split("\n")) {
        const match = line.match(/^FROM\s+(\S+)/);
        if (!match) {
            continue;
        }

        const image = match[1];
        const isBuildStage = stageNames.has(image);
        const isPinnedVariable = image.startsWith("${") && pinnedArgs.has(image.slice(2, -1));
        if (!isBuildStage && !isPinnedVariable && !image.includes("@sha256:")) {
            failures.push(`${relativePath}: imagem FROM sem digest: ${image}`);
        }
    }

    assertIncludes(relativePath, content, "sha256sum --check");
    assertIncludes(relativePath, content, "ARG DBMATE_VERSION=2.36.0");
    assertIncludes(relativePath, content, "dbmate-linux-$" + "{TARGETARCH}");
    assertIncludes(
        relativePath,
        content,
        'install --mode 0755 "$' + '{dbmate_asset}" /usr/local/bin/dbmate',
    );
    assertIncludes(relativePath, content, "deno install --frozen");
    if (content.includes("node:22") || content.includes("node:20") || content.includes("node:18")) {
        failures.push(
            `${relativePath}: imagem de runtime Node não permitida; use a imagem canônica Deno`,
        );
    }
    for (const stage of [
        "quality",
        "dev",
        "quality-ci",
        "playwright",
        "app-build",
        "build-check",
        "runtime",
    ]) {
        if (!content.includes(` AS ${stage}`)) {
            failures.push(`${relativePath}: estágio ausente: ${stage}`);
        }
    }
}

const compose = read(".container/docker-compose.yml");
for (const line of compose.split("\n")) {
    const match = line.match(/^\s+image:\s+(.+)$/);
    if (!match) {
        continue;
    }
    const image = match[1].trim();
    if (!image.includes("portal-guesant-saberes-")) {
        failures.push(`.container/docker-compose.yml: imagem remota não autorizada: ${image}`);
    }
}

const bake = read(".container/docker-bake.hcl");
assertIncludes(".container/docker-bake.hcl", bake, 'dockerfile = ".container/Dockerfile"');
for (const target of [
    "tools",
    "dev",
    "quality",
    "quality-ci",
    "playwright",
    "build-check",
    "runtime",
]) {
    if (!bake.includes(`target "${target}"`)) {
        failures.push(`.container/docker-bake.hcl: target ausente: ${target}`);
    }
}

const migrationsDirectory = path.join(root, ".config/dbmate/migrations");
const schemaPath = path.join(root, ".config/dbmate/schema.sql");
if (!fs.existsSync(schemaPath)) {
    failures.push(".config/dbmate/schema.sql: bootstrap local ausente");
}
if (!fs.existsSync(migrationsDirectory)) {
    failures.push(".config/dbmate/migrations: diretório obrigatório ausente");
} else {
    const migrationFiles = fs
        .readdirSync(migrationsDirectory)
        .filter((entry) => entry.endsWith(".sql"));
    if (migrationFiles.length === 0) {
        failures.push(".config/dbmate/migrations: nenhuma migration SQL encontrada");
    }
    for (const entry of migrationFiles) {
        const migrationPath = path.join(migrationsDirectory, entry);
        const migration = fs.readFileSync(migrationPath, "utf8");
        if (/\b(CREATE|ALTER|DROP|PRAGMA|VACUUM|REINDEX)\b/i.test(migration)) {
            failures.push(
                `${path.relative(root, migrationPath)}: migrations devem conter apenas DML; DDL encontrado`,
            );
        }
    }
}

const justfile = read("justfile");
assertIncludes("justfile", justfile, "docker buildx bake --file .container/docker-bake.hcl");
assertIncludes("justfile", justfile, "portal-guesant-saberes-quality:local");
assertIncludes("justfile", justfile, "deno install --frozen");
assertIncludes("justfile", justfile, "content-migrate");
assertIncludes("justfile", justfile, "migration-format-check");
if (
    justfile.match(
        /docker run[^\n]*(mcr\.microsoft|docker\.io|ghcr\.io|aquasecurity|semgrep\/|zricethezav|fsfe\/|cytopia\/)/,
    )
) {
    failures.push("justfile: ferramenta remota executada diretamente; use a imagem consolidada");
}
if (/(?:corepack|pnpm(?:\s|\/)|npm\s+install)/.test(justfile)) {
    failures.push("justfile: fluxo legado de Node/pnpm detectado; use Deno");
}

const workflowsDirectory = path.join(root, ".github/workflows");
if (fs.existsSync(workflowsDirectory)) {
    for (const entry of fs.readdirSync(workflowsDirectory)) {
        if (!entry.endsWith(".yml") && !entry.endsWith(".yaml")) {
            continue;
        }
        const relativePath = path.join(".github/workflows", entry);
        const workflow = read(relativePath);
        if (workflow.includes(".container/zizmor.Dockerfile")) {
            failures.push(`${relativePath}: referência ao Dockerfile removido do zizmor`);
        }
        if (/(?:setup-node|pnpm\/action|corepack|pnpm install|npm install)/.test(workflow)) {
            failures.push(`${relativePath}: workflow contém instalação legada de Node/pnpm`);
        }
    }
}

if (fs.existsSync(path.join(root, ".container/zizmor.Dockerfile"))) {
    failures.push(".container/zizmor.Dockerfile: Dockerfile auxiliar não permitido");
}

if (fs.existsSync(path.join(root, ".container/tools.Dockerfile"))) {
    failures.push(".container/tools.Dockerfile: Dockerfile duplicado não permitido");
}

if (failures.length > 0) {
    console.error("Supply-chain inválida:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log("Supply-chain válida: lockfiles, imagens, Bake e toolchain verificados.");
