import { join, relative } from "@std/path";
import { format } from "sql-formatter";

const root = Deno.cwd();

const migrationsDirectory = join(root, "packages/thedata/dbmate/migrations");

const configurationPath = join(root, ".config/sql-formatter.json");

const writeMode = Deno.args.includes("--write");

const configuration = JSON.parse(await Deno.readTextFile(configurationPath));

const files = [...Deno.readDirSync(migrationsDirectory)]
  .filter((entry) => {
    return entry.isFile && entry.name.endsWith(".sql");
  })
  .map((entry) => {
    return entry.name;
  })
  .sort()
  .map((file) => {
    return join(migrationsDirectory, file);
  });

if (files.length === 0) {
  throw new Error("Nenhuma migration Dbmate encontrada.");
}

const failures = [];

for (const file of files) {
  const original = await Deno.readTextFile(file);

  const formatted = `${format(original, configuration)
    .trimEnd()}\n`;

  if (!formatted.includes("-- migrate:up") || !formatted.includes("-- migrate:down")) {
    failures.push(`${relative(root, file)}: marcadores do Dbmate foram removidos`);

    continue;
  }

  if (writeMode) {
    await Deno.writeTextFile(file, formatted);
  } else if (original !== formatted) {
    failures.push(`${relative(root, file)}: SQL não formatado`);
  }
}

if (failures.length > 0) {
  if (!writeMode) {
    console.error("Migrations Dbmate não estão formatadas:");

    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
  }

  Deno.exit(1);
}

console.info(
  `${writeMode ? "Migrations formatadas" : "Migrations formatadas e verificadas"}: ${files.length}`,
);
