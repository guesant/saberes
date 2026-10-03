const mode = Deno.args[0];

if (mode !== "update" && mode !== "check") {
  throw new Error("Use update or check");
}

const configPath = ".config/aqua/aqua.yaml";

const checksumPath = ".config/aqua/aqua-checksums.json";

async function runAqua(config: string): Promise<void> {
  const command = new Deno.Command("aqua", {
    args: ["update-checksum", "--config", config, "--prune"],
    stdout: "inherit",
    stderr: "inherit",
  });

  const result = await command.output();

  if (!result.success) {
    Deno.exit(result.code);
  }
}

if (mode === "update") {
  await runAqua(configPath);

  Deno.exit(0);
}

const expected = await Deno.readTextFile(checksumPath);

const temporaryRoot = await Deno.makeTempDir({ prefix: "aqua-checksum-" });

const temporaryConfig = `${temporaryRoot}/aqua.yaml`;

const temporaryChecksum = `${temporaryRoot}/aqua-checksums.json`;

try {
  await Deno.copyFile(configPath, temporaryConfig);

  await Deno.copyFile(checksumPath, temporaryChecksum);

  await Deno.copyFile(".config/aqua/registry.yaml", `${temporaryRoot}/registry.yaml`);

  await Deno.copyFile(".config/aqua/aqua-policy.yaml", `${temporaryRoot}/aqua-policy.yaml`);

  await runAqua(temporaryConfig);

  const actual = await Deno.readTextFile(temporaryChecksum);

  if (actual !== expected) {
    console.error("aqua-checksums.json está desatualizado");

    Deno.exit(1);
  }
} finally {
  await Deno.remove(temporaryRoot, { recursive: true });
}
