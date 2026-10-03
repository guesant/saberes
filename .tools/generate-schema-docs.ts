import initSqlJs from "sql.js";
import { dirname, join, resolve } from "@std/path";

const root = Deno.cwd();
const databasePath =
    Deno.env.get("SCHEMA_DOCS_DATABASE") || join(root, ".cache/schema-docs/editorial.sqlite");
const outputPath = Deno.env.get("SCHEMA_DOCS_OUTPUT") || join(root, ".cache/schema-docs/site");
const migrationsDirectory = join(root, "packages/thedata/dbmate/migrations");
const schemaspyType = join(root, ".tools/schemaspy/sqlite.properties");
const schemaspyJar = Deno.env.get("SCHEMASPY_JAR") || "/opt/schemaspy/schemaspy.jar";
const sqliteJdbcJar = Deno.env.get("SQLITE_JDBC_JAR") || "/opt/schemaspy/sqlite-jdbc.jar";

async function removeIfPresent(path: string) {
    try {
        await Deno.remove(path, { recursive: true });
    } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) throw error;
    }
}

async function run(command: string, args: string[]) {
    const result = await new Deno.Command(command, {
        args,
        cwd: root,
        stdout: "piped",
        stderr: "piped",
    }).output();
    const stdout = new TextDecoder().decode(result.stdout).trim();
    const stderr = new TextDecoder().decode(result.stderr).trim();
    if (!result.success) {
        throw new Error(
            `Falha ao executar ${command}${stderr ? `:\n${stderr}` : ""}${stdout ? `\n${stdout}` : ""}`,
        );
    }
    if (stdout) console.log(stdout);
}

await Deno.stat(migrationsDirectory);
await Deno.stat(schemaspyType);
await Deno.stat(schemaspyJar);
await Deno.stat(sqliteJdbcJar);

await removeIfPresent(databasePath);
await removeIfPresent(outputPath);
await Deno.mkdir(dirname(databasePath), { recursive: true });
await Deno.mkdir(outputPath, { recursive: true });

const SQL = await initSqlJs({
    locateFile: (file) => join(root, "node_modules/sql.js/dist", file),
});
const emptyDatabase = new SQL.Database();
Deno.writeFileSync(databasePath, emptyDatabase.export());
emptyDatabase.close();

await run("dbmate", [
    "--url",
    `sqlite:${databasePath}`,
    "--migrations-dir",
    migrationsDirectory,
    "--no-dump-schema",
    "up",
]);

await run("java", [
    "-jar",
    schemaspyJar,
    "-t",
    schemaspyType,
    "-u",
    "schema-docs",
    "-cat",
    "%",
    "-s",
    "main",
    "-dp",
    sqliteJdbcJar,
    "-db",
    databasePath,
    "-o",
    outputPath,
    "-vizjs",
    "-norows",
]);

const indexPath = resolve(outputPath, "index.html");
await Deno.stat(indexPath);
console.log(`Documentação SchemaSpy gerada em ${indexPath}`);
