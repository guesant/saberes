import { join, relative } from "@std/path";

const root = Deno.cwd();
const failures = [];

for (const entry of Deno.readDirSync(join(root, ".tools"))) {
    if (entry.isFile && /\.(?:mjs|cjs|js)$/u.test(entry.name)) {
        failures.push(`.tools/${entry.name}: scripts de automação devem usar TypeScript/Deno`);
    }
    if (entry.isFile && entry.name.endsWith(".ts") && entry.name !== "check-supply-chain.ts") {
        const source = Deno.readTextFileSync(join(root, ".tools", entry.name));
        if (
            /from\s+["']node:/u.test(source) ||
            /\bprocess\.(?:cwd|env|exit|exitCode)\b/u.test(source) ||
            /\bBuffer\.(?:from|alloc|allocUnsafe)\b/u.test(source)
        ) {
            failures.push(`.tools/${entry.name}: API Node incompatível com o toolchain Deno`);
        }
    }
}

const read = (relativePath) => {
    const filePath = join(root, relativePath);
    try {
        return Deno.readTextFileSync(filePath);
    } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) throw error;
        failures.push(`${relativePath}: arquivo obrigatório ausente`);
        return "";
    }
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
const aquaManifest = read(".config/aqua/aqua.yaml");
const aquaChecksums = read(".config/aqua/aqua-checksums.json");
const aquaRegistry = read(".config/aqua/registry.yaml");
const pythonTools = read(".config/aqua/python-tools.txt");
const miseConfig = read(".config/mise/mise.toml");
const miseLock = read(".config/mise/mise.lock");
for (const tool of ["lizard==1.17.19", "reuse==5.1.1", "semgrep==1.133.0"]) {
    assertIncludes(".config/aqua/python-tools.txt", pythonTools, tool);
}
for (const packageName of [
    "astral-sh/uv@0.12.22",
    "jqlang/jq@jq-1.8.1",
    "koalaman/shellcheck@v0.11.0",
    "zizmorcore/zizmor@v1.11.0",
    "wasilibs/go-yamllint@v1.37.1",
    "gitleaks/gitleaks@v8.28.0",
    "google/osv-scanner@v2.0.2",
    "aquasecurity/trivy@v0.75.0",
    "rhysd/actionlint@v1.7.9",
    "hadolint/hadolint@v2.14.0",
    "lycheeverse/lychee@lychee-v0.24.2",
    "amacneil/dbmate@v2.36.0",
]) {
    assertIncludes(".config/aqua/aqua.yaml", aquaManifest, packageName);
}
assertIncludes(".config/mise/mise.toml", miseConfig, 'deno = "2.9.7"');
assertIncludes(".config/mise/mise.toml", miseConfig, 'python = "3.13.7"');
if (!/^\[\[tools\.deno\]\]/mu.test(miseLock) || !/^\[\[tools\.python\]\]/mu.test(miseLock)) {
    failures.push(".config/mise/mise.lock: resoluções de runtime ausentes");
}
assertIncludes(".config/aqua/aqua.yaml", aquaManifest, "require_checksum: true");
assertIncludes(".config/aqua/aqua.yaml", aquaManifest, "type: local");
assertIncludes(".config/aqua/registry.yaml", aquaRegistry, "packages: []");
if (!aquaChecksums.includes('"checksums": [') || aquaChecksums.includes('"checksums": []')) {
    failures.push(".config/aqua/aqua-checksums.json: checksums Aqua ausentes");
}
const packageManifest = read("package.json");
const denoConfig = read("deno.json");
assertIncludes("package.json", packageManifest, '"sql-formatter"');
assertIncludes("deno.json", denoConfig, '"db:format"');
assertIncludes("deno.json", denoConfig, '"db:format:check"');
assertIncludes("deno.json", denoConfig, '"database:schema-docs"');
assertIncludes("deno.json", denoConfig, '"comments"');
assertIncludes(".config/ast-grep/sgconfig.yml", read(".config/ast-grep/sgconfig.yml"), "ruleDirs:");
assertIncludes(
    ".config/ast-grep/rules/no-narrative-comments-typescript.yml",
    read(".config/ast-grep/rules/no-narrative-comments-typescript.yml"),
    "no-narrative-comments-typescript",
);

const dockerfiles = [".config/container/Dockerfile"];
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
    assertIncludes(relativePath, content, "ARG AQUA_VERSION=2.63.0");
    assertIncludes(relativePath, content, "ARG MISE_VERSION=2026.10.0");
    assertIncludes(relativePath, content, "MISE_SHA256_AMD64");
    assertIncludes(relativePath, content, "MISE_LOCKED=1");
    assertIncludes(relativePath, content, "mise install --locked");
    assertIncludes(relativePath, content, "AQUA_SHA256_AMD64");
    assertIncludes(relativePath, content, "AQUA_ENFORCE_REQUIRE_CHECKSUM=true");
    assertIncludes(relativePath, content, "aqua install");
    assertIncludes(relativePath, content, "uv tool install");
    assertIncludes(relativePath, content, "python-tools.txt");
    assertIncludes(relativePath, content, "ARG SCHEMASPY_VERSION=7.0.2");
    assertIncludes(relativePath, content, "ARG SQLITE_JDBC_VERSION=3.53.4.0");
    assertIncludes(relativePath, content, "openjdk-21-jre");
    assertIncludes(relativePath, content, "schemaspy-app.jar");
    assertIncludes(relativePath, content, "sqlite-jdbc.jar");
    assertIncludes(relativePath, content, "sha512sum --check");
    if (
        /(?:GITLEAKS_VERSION|OSV_SCANNER_VERSION|TRIVY_VERSION|ACTIONLINT_VERSION|HADOLINT_VERSION|LYCHEE_VERSION|DBMATE_VERSION)/u.test(
            content,
        )
    ) {
        failures.push(`${relativePath}: versões de CLIs devem vir do .config/aqua/aqua.yaml`);
    }
    if (/pip install|quality-venv|dbmate-linux-|gitleaks_asset|trivy_asset/u.test(content)) {
        failures.push(`${relativePath}: instalação direta legada de tooling detectada`);
    }
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

const compose = read(".config/container/docker-compose.yml");
for (const line of compose.split("\n")) {
    const match = line.match(/^\s+image:\s+(.+)$/);
    if (!match) {
        continue;
    }
    const image = match[1].trim();
    if (!image.includes("portal-guesant-saberes-")) {
        failures.push(
            `.config/container/docker-compose.yml: imagem remota não autorizada: ${image}`,
        );
    }
}

const bake = read(".config/container/docker-bake.hcl");
assertIncludes(
    ".config/container/docker-bake.hcl",
    bake,
    'dockerfile = ".config/container/Dockerfile"',
);
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
        failures.push(`.config/container/docker-bake.hcl: target ausente: ${target}`);
    }
}

const migrationsDirectory = join(root, "packages/thedata/dbmate/migrations");
const exists = (filePath) => {
    try {
        Deno.statSync(filePath);
        return true;
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) return false;
        throw error;
    }
};
if (!exists(migrationsDirectory)) {
    failures.push("packages/thedata/dbmate/migrations: diretório obrigatório ausente");
} else {
    const migrationFiles = [...Deno.readDirSync(migrationsDirectory)]
        .filter((entry) => entry.isFile && entry.name.endsWith(".sql"))
        .map((entry) => entry.name);
    if (migrationFiles.length === 0) {
        failures.push("packages/thedata/dbmate/migrations: nenhuma migration SQL encontrada");
    }
    for (const entry of migrationFiles) {
        const migrationPath = join(migrationsDirectory, entry);
        const migration = Deno.readTextFileSync(migrationPath);
        if (!migration.includes("-- migrate:up") || !migration.includes("-- migrate:down")) {
            failures.push(`${relative(root, migrationPath)}: marcadores do Dbmate ausentes`);
        }
    }
}

const justfile = read("justfile");
assertIncludes("justfile", justfile, "docker buildx bake --file .config/container/docker-bake.hcl");
assertIncludes("justfile", justfile, "portal-guesant-saberes-quality:local");
assertIncludes("justfile", justfile, "mise exec -- deno install --frozen");
assertIncludes("justfile", justfile, "content-migrate");
assertIncludes("justfile", justfile, "migration-format-check");
assertIncludes("justfile", justfile, "comments:");
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

const workflowsDirectory = join(root, ".github/workflows");
if (exists(workflowsDirectory)) {
    for (const entry of Deno.readDirSync(workflowsDirectory)) {
        if (!entry.isFile || (!entry.name.endsWith(".yml") && !entry.name.endsWith(".yaml"))) {
            continue;
        }
        const relativePath = join(".github/workflows", entry.name);
        const workflow = read(relativePath);
        if (workflow.includes(".config/container/zizmor.Dockerfile")) {
            failures.push(`${relativePath}: referência ao Dockerfile removido do zizmor`);
        }
        if (/(?:setup-node|pnpm\/action|corepack|pnpm install|npm install)/.test(workflow)) {
            failures.push(`${relativePath}: workflow contém instalação legada de Node/pnpm`);
        }
    }
}

if (exists(join(root, ".config/container/zizmor.Dockerfile"))) {
    failures.push(".config/container/zizmor.Dockerfile: Dockerfile auxiliar não permitido");
}

if (exists(join(root, ".config/container/tools.Dockerfile"))) {
    failures.push(".config/container/tools.Dockerfile: Dockerfile duplicado não permitido");
}

if (failures.length > 0) {
    console.error("Supply-chain inválida:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    Deno.exit(1);
}

console.log("Supply-chain válida: lockfiles, imagens, Bake e toolchain verificados.");
