import initSqlJs from "sql.js";
import { createSyntheticContentDatabase } from "./create-synthetic-content-database.function";
import { fetchContentDatabase } from "./fetch-content-database.function";
import { mapSqlResults } from "./map-sql-results.function";
import type { ContentDatabase } from "./content-database.type";

const primaryUrl =
  import.meta.env.VITE_CONTENT_DB_URL || `${import.meta.env.BASE_URL}data/content.sqlite`;

const fallbackUrl = `${import.meta.env.BASE_URL}data/content.sqlite`;

let databasePromise: Promise<ContentDatabase> | undefined;

let databaseValue: ContentDatabase | undefined;

export async function loadContentDatabase(): Promise<ContentDatabase> {
  if (databaseValue) {
    return databaseValue;
  }

  if (!databasePromise) {
    databasePromise = (async () => {
      let bytes: Uint8Array;

      let source = primaryUrl;

      try {
        bytes = await fetchContentDatabase(primaryUrl);
      } catch {
        if (primaryUrl === fallbackUrl) {
          return createSyntheticContentDatabase();
        }

        try {
          bytes = await fetchContentDatabase(fallbackUrl);
        } catch {
          return createSyntheticContentDatabase();
        }

        source = fallbackUrl;
      }

      const SQL = await initSqlJs({
        locateFile: () => {
          return `${import.meta.env.BASE_URL}sql-wasm.wasm`;
        },
      });

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
    })()
      .then((database) => {
        databaseValue = database;

        return database;
      })
      .finally(() => {
        databasePromise = undefined;
      });
  }

  return databasePromise;
}
