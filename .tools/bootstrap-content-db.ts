import initSqlJs from "sql.js";
import { dirname, join } from "@std/path";

const root = Deno.cwd();
const databasePath =
    Deno.env.get("CONTENT_MIGRATION_DB") || join(root, ".cache/content/editorial.sqlite");
const migrationsDirectory = join(root, "packages/thedata/dbmate/migrations");

const SQL = await initSqlJs({
    locateFile: (file) => join(root, "node_modules/sql.js/dist", file),
});

function hasSchema(sqlDatabase: { exec: (sql: string) => Array<{ values: unknown[][] }> }) {
    const result = sqlDatabase.exec(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'universities' LIMIT 1",
    );
    return result[0]?.values.length === 1;
}

function hasCurrentSchemaMigration(sqlDatabase: {
    exec: (sql: string) => Array<{ values: unknown[][] }>;
}) {
    try {
        const result = sqlDatabase.exec(
            "SELECT 1 FROM schema_migrations WHERE version = '20261002000000' LIMIT 1",
        );
        return result[0]?.values.length === 1;
    } catch {
        return false;
    }
}

Deno.mkdirSync(dirname(databasePath), { recursive: true });
let useExistingDatabase = false;
try {
    const existing = new SQL.Database(Deno.readFileSync(databasePath));
    useExistingDatabase = hasSchema(existing) && hasCurrentSchemaMigration(existing);
    existing.close();
    if (!useExistingDatabase) {
        Deno.removeSync(databasePath);
    }
} catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
}

if (!useExistingDatabase) {
    const database = new SQL.Database();
    Deno.writeFileSync(databasePath, database.export());
    database.close();
}

const migration = await new Deno.Command("dbmate", {
    args: [
        "--url",
        `sqlite:${databasePath}`,
        "--migrations-dir",
        migrationsDirectory,
        "--no-dump-schema",
        "up",
    ],
    cwd: root,
    stdout: "piped",
    stderr: "piped",
}).output();

if (!migration.success) {
    const details = new TextDecoder().decode(migration.stderr).trim();
    throw new Error(`Falha ao aplicar migrations Dbmate${details ? `:\n${details}` : ""}`);
}

console.log(`Bootstrap local concluído pelas migrations Dbmate: ${databasePath}`);
