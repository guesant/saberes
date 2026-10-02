import fs from "node:fs";
import path from "node:path";
import initSqlJs from "sql.js";

const root = process.cwd();
const databasePath =
    process.env.CONTENT_MIGRATION_DB ||
    path.join(root, ".cache/content/editorial.sqlite");
const schemaPath = path.join(root, ".config/dbmate/schema.sql");

const SQL = await initSqlJs({
    locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
});

function hasSchema(database: {
    exec: (sql: string) => Array<{ values: unknown[][] }>;
}) {
    const result = database.exec(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'universities' LIMIT 1",
    );
    return result[0]?.values.length === 1;
}

fs.mkdirSync(path.dirname(databasePath), { recursive: true });
if (fs.existsSync(databasePath)) {
    const existing = new SQL.Database(fs.readFileSync(databasePath));
    if (hasSchema(existing)) {
        console.log(`Banco local já inicializado: ${databasePath}`);
        Deno.exit(0);
    }
}

const schema = fs
    .readFileSync(schemaPath, "utf8")
    .split("-- migrate:down", 1)[0]
    .replace(/^-- migrate:up\s*/, "");
const database = new SQL.Database();
database.run(schema);
fs.writeFileSync(databasePath, Buffer.from(database.export()));
console.log(`Bootstrap local concluído: ${databasePath}`);
