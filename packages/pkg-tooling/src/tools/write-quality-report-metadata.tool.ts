const outputPath =
  Deno.env.get("QUALITY_REPORT_METADATA_PATH") ?? ".cache/quality-report-metadata.json";

const outputDirectory = outputPath.includes("/")
  ? outputPath.slice(0, outputPath.lastIndexOf("/"))
  : ".";

const report = {
  schemaVersion: 1,
  generatedAt: Deno.env.get("REPORT_GENERATED_AT") ?? new Date()
    .toISOString(),
  commit: Deno.env.get("SOURCE_COMMIT") ?? "local-uncommitted",
  toolchainImage: Deno.env.get("TOOLCHAIN_IMAGE") ?? "local-toolchain",
  scope: Deno.env.get("REPORT_SCOPE") ?? "unspecified",
  reports: [
    { name: "lighthouse", path: ".cache/lighthouse" },
    { name: "complexity", path: ".cache/lizard.txt" },
    { name: "qlty", path: ".cache/qlty-report.sarif" },
    { name: "sbom", path: ".cache/sbom" },
  ],
};

await Deno.mkdir(outputDirectory, { recursive: true });

await Deno.writeTextFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
