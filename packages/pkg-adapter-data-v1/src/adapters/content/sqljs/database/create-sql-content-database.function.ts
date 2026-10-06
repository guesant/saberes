import initSqlJs from "sql.js";
import { mapSqlResults } from "./map-sql-results.function";
import { runContentLoadWithTimeout } from "./run-content-load-with-timeout.function";
import { validateContentDatabaseHeader } from "./validate-content-database-header.function";
import { validateContentDatabaseSchema } from "./validate-content-database-schema.function";
import type { ContentDatabase } from "./content-database.type";
import type { Database } from "sql.js";

export async function createSqlContentDatabase(
  bytes: Uint8Array,
  source: string,
): Promise<ContentDatabase> {
  validateContentDatabaseHeader(bytes);

  const SQL = await runContentLoadWithTimeout(
    initSqlJs({
      locateFile: () => {
        return `${import.meta.env.BASE_URL}sql-wasm.wasm`;
      },
    })
      .catch((cause: unknown) => {
        throw new Error("Não foi possível iniciar o leitor de conteúdo SQLite.", { cause });
      }),
    "O leitor de conteúdo SQLite demorou demais para carregar. Tente novamente.",
  );

  let database: Database;

  try {
    database = new SQL.Database(bytes);
  } catch (cause) {
    throw new Error("O banco de conteúdo SQLite está inválido ou corrompido.", { cause });
  }

  try {
    validateContentDatabaseSchema(database);
  } catch (cause) {
    database.close();

    throw new Error("O banco de conteúdo SQLite está corrompido ou tem uma estrutura incompatível.", { cause });
  }

  return {
    source,
    query(sql: string, params: unknown[] = []) {
      return mapSqlResults(database.exec(sql, params));
    },
    get(sql: string, params: unknown[] = []) {
      return mapSqlResults(database.exec(sql, params))[0] ?? null;
    },
  };
}
