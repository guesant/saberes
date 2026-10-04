import { dirname, join, resolve } from "@std/path";
import initSqlJs from "sql.js";

const root = Deno.cwd();

const databasePath =
  Deno.env.get("SCHEMA_DOCS_DATABASE") || join(root, ".cache/schema-docs/editorial.sqlite");

const requestedOutputPath = Deno.env.get("SCHEMA_DOCS_OUTPUT");

const outputPath = requestedOutputPath || join(root, ".cache/schema-docs/site-staging");

const publishedOutputPath = requestedOutputPath || join(root, ".cache/schema-docs/site");

const migrationsDirectory = join(root, "packages/thedata/dbmate/migrations");

const schemaspyType = join(root, ".config/schemaspy/sqlite.properties");

const aquaRoot = Deno.env.get("AQUA_ROOT_DIR") || "/opt/aqua";

const dbmate = join(aquaRoot, "bin/dbmate");

const schemaspyJar = Deno.env.get("SCHEMASPY_JAR") || join(aquaRoot, "jars/schemaspy.jar");

const sqliteJdbcJar = Deno.env.get("SQLITE_JDBC_JAR") || join(aquaRoot, "jars/sqlite-jdbc.jar");

export async function removeIfPresent(path: string) {
  try {
    await Deno.remove(path, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }
}

export async function run(command: string, args: string[]) {
  const result = await new Deno.Command(command, {
    args,
    cwd: root,
    stdout: "piped",
    stderr: "piped",
  })
    .output();

  const stdout = new TextDecoder()
    .decode(result.stdout)
    .trim();

  const stderr = new TextDecoder()
    .decode(result.stderr)
    .trim();

  if (!result.success) {
    throw new Error(
      `Falha ao executar ${command}${stderr ? `:\n${stderr}` : ""}${stdout ? `\n${stdout}` : ""}`,
    );
  }

  if (stdout) {
    console.info(stdout);
  }
}

await Deno.stat(migrationsDirectory);

await Deno.stat(schemaspyType);

await Deno.stat(schemaspyJar);

await Deno.stat(sqliteJdbcJar);

await removeIfPresent(databasePath);

await removeIfPresent(outputPath);

await Deno.mkdir(dirname(databasePath), { recursive: true });

const SQL = await initSqlJs({
  locateFile: (file: string) => {
    return join(root, "node_modules/sql.js/dist", file);
  },
});

const emptyDatabase = new SQL.Database();

Deno.writeFileSync(databasePath, emptyDatabase.export());

emptyDatabase.close();

await run(dbmate, [
  "--url",
  `sqlite:${databasePath}`,
  "--migrations-dir",
  migrationsDirectory,
  "--no-dump-schema",
  "up",
]);

let successfulOutputPath = outputPath;

let lastSchemaSpyError = "";

for (let attempt = 1; attempt <= 3; attempt += 1) {
  const attemptOutputPath = outputPath;

  await removeIfPresent(attemptOutputPath);

  await Deno.mkdir(attemptOutputPath, { recursive: true });

  try {
    const javaHome = Deno.env.get("JAVA_HOME");

    const javaExecutable = javaHome ? join(javaHome, "bin/java") : "java";

    const javaEnvironment = Object.fromEntries(
      Object.entries(Deno.env.toObject())
        .filter(([name]) => {
          return ["PATH", "HOME", "LANG", "LC_ALL", "TZ", "TMPDIR"].includes(name);
        }),
    );

    const schemaSpyCommand = new Deno.Command(javaExecutable, {
      args: [
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
        attemptOutputPath,
      ],
      cwd: root,
      env: javaEnvironment,
      stdout: "inherit",
      stderr: "inherit",
    });

    const schemaSpyProcess = schemaSpyCommand.spawn();

    const schemaSpyStatus = await schemaSpyProcess.status;

    if (!schemaSpyStatus.success) {
      throw new Error(`Falha ao executar java (código ${schemaSpyStatus.code}).`);
    }

    successfulOutputPath = attemptOutputPath;

    break;
  } catch (error) {
    lastSchemaSpyError = error instanceof Error ? error.message : String(error);

    if (attempt === 3) {
      throw new Error(`SchemaSpy falhou após 3 tentativas.\n${lastSchemaSpyError}`);
    }

    await removeIfPresent(attemptOutputPath);
  }
}

if (!requestedOutputPath) {
  await removeIfPresent(publishedOutputPath);

  await Deno.rename(successfulOutputPath, publishedOutputPath);
}

const indexPath = resolve(publishedOutputPath, "index.html");

await Deno.stat(indexPath);

console.info(`Documentação SchemaSpy gerada em ${indexPath}`);
