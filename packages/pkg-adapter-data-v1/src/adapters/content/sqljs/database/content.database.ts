import initSqlJs from "sql.js";
import { fetchContentDatabase } from "./fetch-content-database.function";
import { mapSqlResults } from "./map-sql-results.function";
import type { ContentDatabase } from "./content-database.types";

const primaryUrl =
  import.meta.env.VITE_CONTENT_DB_URL || `${import.meta.env.BASE_URL}data/content.sqlite`;

const fallbackUrl = `${import.meta.env.BASE_URL}data/content.sqlite`;

let databasePromise: Promise<ContentDatabase> | undefined;

export async function loadContentDatabase(): Promise<ContentDatabase> {
  if (!databasePromise) {
    const pendingDatabase = (async () => {
      const SQL = await initSqlJs({
        locateFile: () => `${import.meta.env.BASE_URL}sql-wasm.wasm`,
      });

      let bytes: Uint8Array;

      let source = primaryUrl;

      try {
        bytes = await fetchContentDatabase(primaryUrl);
      } catch (primaryError) {
        if (primaryUrl === fallbackUrl) {
          throw primaryError;
        }

        bytes = await fetchContentDatabase(fallbackUrl);

        source = fallbackUrl;
      }

      const db = new SQL.Database(bytes);

      return {
        source,
        query(sql: string, params: unknown[] = []) {
          return mapSqlResults(db.exec(sql, params));
        },
        get(sql: string, params: unknown[] = []) {
          return mapSqlResults(db.exec(sql, params))[0] ?? null;
        },
      };
    })();

    const recoverableDatabase = pendingDatabase.catch((error) => {
      if (databasePromise === recoverableDatabase) {
        databasePromise = undefined;
      }

      throw error;
    });

    databasePromise = recoverableDatabase;
  }

  return databasePromise;
}
