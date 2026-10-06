import { createSqlContentDatabase } from "./create-sql-content-database.function";
import { createSyntheticContentDatabase } from "./create-synthetic-content-database.function";
import { fetchContentDatabase } from "./fetch-content-database.function";
import type { ContentDatabase } from "./content-database.type";

let databasePromise: Promise<ContentDatabase> | undefined;

let databaseValue: ContentDatabase | undefined;

export async function loadContentDatabase(): Promise<ContentDatabase> {
  if (databaseValue) {
    return databaseValue;
  }

  if (!databasePromise) {
    databasePromise = (async () => {
      if (import.meta.env.VITE_CONTENT_MODE === "synthetic") {
        if (import.meta.env.PROD) {
          throw new Error("O conteúdo sintético está disponível apenas em desenvolvimento e testes.");
        }

        return createSyntheticContentDatabase();
      }

      const source = import.meta.env.VITE_CONTENT_DB_URL || `${import.meta.env.BASE_URL}data/content.sqlite`;

      const bytes = await fetchContentDatabase(source);

      return createSqlContentDatabase(bytes, source);
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
