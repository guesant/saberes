import fs from "node:fs";
import path from "node:path";
import { format } from "npm:sql-formatter@15.9.0";

const root = process.cwd();
const migrationsDirectory = path.join(root, ".config/dbmate/migrations");
const configurationPath = path.join(root, ".config/sql-formatter.json");
const writeMode = Deno.args.includes("--write");
const configuration = JSON.parse(fs.readFileSync(configurationPath, "utf8"));
const files = fs
    .readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => path.join(migrationsDirectory, file));

if (files.length === 0) throw new Error("Nenhuma migration Dbmate encontrada.");

const failures = [];
for (const file of files) {
    const original = fs.readFileSync(file, "utf8");
    const formatted = `${format(original, configuration).trimEnd()}\n`;

    if (
        !formatted.includes("-- migrate:up") ||
        !formatted.includes("-- migrate:down")
    ) {
        failures.push(
            `${path.relative(root, file)}: marcadores do Dbmate foram removidos`,
        );
        continue;
    }

    if (writeMode) {
        fs.writeFileSync(file, formatted);
    } else if (original !== formatted) {
        failures.push(`${path.relative(root, file)}: SQL não formatado`);
    }
}

if (failures.length > 0) {
    if (!writeMode) {
        console.error("Migrations Dbmate não estão formatadas:");
        for (const failure of failures) console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log(
    `${writeMode ? "Migrations formatadas" : "Migrations formatadas e verificadas"}: ${files.length}`,
);
