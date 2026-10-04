import * as v from "valibot";

const target = Deno.args[0] ?? "source";

const outputDirectory = `${Deno.cwd()}/.cache/sbom`;

const denoLockSchema = v.object({
  version: v.string(),
  npm: v.record(
    v.string(),
    v.object({
      integrity: v.optional(v.string()),
    }),
  ),
  jsr: v.record(
    v.string(),
    v.object({
      integrity: v.optional(v.string()),
    }),
  ),
});

type DenoLock = v.InferOutput<typeof denoLockSchema>;

type LockPackage = {
  integrity?: string;
};

type CycloneDxHash = {
  alg: "SHA-512";
  content: string;
};

type CycloneDxProperty = {
  name: string;
  value: string;
};

type CycloneDxComponent = {
  bomRef: string;
  type: "library";
  group?: string;
  name: string;
  version: string;
  hashes?: CycloneDxHash[];
  purl: string;
  properties?: CycloneDxProperty[];
};

interface ParsedNpmPackage {
  name: string;
  version: string;
}

export function readDenoLock(): DenoLock {
  const text = Deno.readTextFileSync("deno.lock");

  return v.parse(denoLockSchema, JSON.parse(text));
}

export function parseNpmPackageKey(packageKey: string): ParsedNpmPackage {
  const packageSeparator = packageKey.startsWith("@")
    ? packageKey.indexOf("@", packageKey.indexOf("/") + 1)
    : packageKey.indexOf("@");

  if (packageSeparator < 1) {
    throw new Error(`Chave npm inválida no deno.lock: ${packageKey}`);
  }

  const name = packageKey.slice(0, packageSeparator);

  const version = packageKey.slice(packageSeparator + 1).split("_")[0];

  if (version.length === 0) {
    throw new Error(`Versão npm ausente no deno.lock: ${packageKey}`);
  }

  return { name, version };
}

export function npmPurl(name: string, version: string): string {
  const encodedName = name.startsWith("@") ? `%40${name.slice(1)}` : name;

  return `pkg:npm/${encodedName}@${version}`;
}

export function jsrPurl(name: string, version: string): string {
  return `pkg:generic/jsr/${name}@${version}`;
}

export function createNpmComponent(
  packageKey: string,
  packageData: LockPackage,
): CycloneDxComponent {
  const packageInfo = parseNpmPackageKey(packageKey);

  const purl = npmPurl(packageInfo.name, packageInfo.version);

  const component: CycloneDxComponent = {
    bomRef: purl,
    type: "library",
    name: packageInfo.name,
    version: packageInfo.version,
    purl,
    properties: [{ name: "guesant:source", value: "deno.lock" }],
  };

  if (packageData.integrity?.startsWith("sha512-")) {
    component.hashes = [
      {
        alg: "SHA-512",
        content: packageData.integrity.slice("sha512-".length),
      },
    ];
  }

  return component;
}

export function createJsrComponent(
  packageKey: string,
  packageData: LockPackage,
): CycloneDxComponent {
  const separator = packageKey.lastIndexOf("@");

  if (separator < 1) {
    throw new Error(`Chave JSR inválida no deno.lock: ${packageKey}`);
  }

  const name = packageKey.slice(0, separator);

  const version = packageKey.slice(separator + 1);

  const purl = jsrPurl(name, version);

  const component: CycloneDxComponent = {
    bomRef: purl,
    type: "library",
    group: "jsr",
    name,
    version,
    purl,
    properties: [{ name: "guesant:source", value: "deno.lock" }],
  };

  if (packageData.integrity) {
    component.hashes = [
      {
        alg: "SHA-512",
        content: packageData.integrity,
      },
    ];
  }

  return component;
}

export function createSourceBom(lockFile: DenoLock): string {
  const npmComponents = Object.entries(lockFile.npm).map(([packageKey, packageData]) =>
    createNpmComponent(packageKey, packageData),
  );

  const jsrComponents = Object.entries(lockFile.jsr).map(([packageKey, packageData]) =>
    createJsrComponent(packageKey, packageData),
  );

  const components = [...npmComponents, ...jsrComponents].sort((left, right) =>
    left.purl.localeCompare(right.purl),
  );

  return JSON.stringify(
    {
      $schema: "http://cyclonedx.org/schema/bom-1.6.schema.json",
      bomFormat: "CycloneDX",
      specVersion: "1.6",
      version: 1,
      metadata: {
        component: {
          type: "application",
          name: "portal-guesant-saberes",
          version: lockFile.version,
        },
        properties: [
          { name: "guesant:source", value: "deno.lock" },
          { name: "guesant:lockfile-version", value: lockFile.version },
        ],
      },
      components,
    },
    null,
    2,
  );
}

export async function generateSourceSbom(): Promise<void> {
  const lockFile = readDenoLock();

  await Deno.mkdir(outputDirectory, { recursive: true });

  await Deno.writeTextFile(`${outputDirectory}/source.cdx.json`, `${createSourceBom(lockFile)}\n`);
}

export async function runSyft(source: string, outputFile: string): Promise<void> {
  const command = new Deno.Command("syft", {
    args: [
      source,
      "--exclude",
      "**/.cache/**",
      "--exclude",
      "**/.git/**",
      "--output",
      `cyclonedx-json=${outputFile}`,
    ],
    stdout: "inherit",
    stderr: "inherit",
  });

  const result = await command.output();

  if (!result.success) {
    throw new Error(`Syft falhou ao gerar ${outputFile}`);
  }
}

export async function generateImageSbom(): Promise<void> {
  const image = Deno.env.get("SBOM_IMAGE");

  if (!image) {
    throw new Error("SBOM_IMAGE é obrigatório para gerar o SBOM da imagem");
  }

  await Deno.mkdir(outputDirectory, { recursive: true });

  await runSyft(`docker:${image}`, `${outputDirectory}/image.cdx.json`);
}

if (target === "source") {
  await generateSourceSbom();
} else if (target === "image") {
  await generateImageSbom();
} else {
  throw new Error("Use source ou image");
}
