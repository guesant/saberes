const mode = Deno.args[0];

if (mode !== "update" && mode !== "check") {
  throw new Error("Use update or check");
}

const dockerfilePath = ".config/container/Dockerfile";

const original = await Deno.readTextFile(dockerfilePath);

let rendered = original;

const targets = [
  {
    name: "mise",
    pattern:
      /(?<prefix>ARG MISE_VERSION=)(?<version>[^\s]+)(?<amd64Prefix>[\s\S]*?ARG MISE_SHA256_AMD64=)(?<amd64>[a-f0-9]+)(?<arm64Prefix>[\s\S]*?ARG MISE_SHA256_ARM64=)(?<arm64>[a-f0-9]+)/,
    url: (version: string, architecture: string): string => {
      return `https://github.com/jdx/mise/releases/download/v${version}/mise-v${version}-linux-${architecture}`;
    },
  },
  {
    name: "aqua",
    pattern:
      /(?<prefix>ARG AQUA_VERSION=)(?<version>[^\s]+)(?<amd64Prefix>[\s\S]*?ARG AQUA_SHA256_AMD64=)(?<amd64>[a-f0-9]+)(?<arm64Prefix>[\s\S]*?ARG AQUA_SHA256_ARM64=)(?<arm64>[a-f0-9]+)/,
    url: (version: string, architecture: string): string => {
      return `https://github.com/aquaproj/aqua/releases/download/v${version}/aqua_linux_${architecture}.tar.gz`;
    },
  },
];

for (const target of targets) {
  const match = rendered.match(target.pattern);

  if (!match?.groups) {
    throw new Error(`Bloco de checksum não encontrado: ${target.name}`);
  }

  const { version } = match.groups;

  const checksums = new Map<string, string>();

  for (const architecture of ["amd64", "arm64"]) {
    const assetArchitecture =
      target.name === "mise" && architecture === "amd64" ? "x64" : architecture;

    let response: Response | undefined;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        response = await fetch(target.url(version, assetArchitecture), {
          signal: AbortSignal.timeout(30_000),
        });
      } catch {
        if (attempt === 2) {
          throw new Error(`Download falhou após 3 tentativas: ${target.name} ${architecture}`);
        }
      }

      if (response?.ok) {
        break;
      }
    }

    if (!response?.ok) {
      throw new Error(`Download falhou: ${response?.status ?? "sem resposta"} ${target.name} ${architecture}`);
    }

    const digest = await crypto.subtle.digest("SHA-256", await response.arrayBuffer());

    const checksum = Array.from(new Uint8Array(digest), (byte) => {
      return byte.toString(16)
        .padStart(2, "0");
    })
      .join("");

    checksums.set(architecture, checksum);
  }

  const replacement = [
    `${match.groups.prefix}${version}`,
    `${match.groups.amd64Prefix}${checksums.get("amd64")}`,
    `${match.groups.arm64Prefix}${checksums.get("arm64")}`,
  ].join("");

  rendered = rendered.replace(match[0], replacement);
}

if (mode === "update") {
  await Deno.writeTextFile(dockerfilePath, rendered);
}

if (mode === "check" && rendered !== original) {
  throw new Error("Checksums de bootstrap desatualizados");
}
