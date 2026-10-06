import type { ContentDatabase } from "./content-database.type";

export interface ContentDatabaseProviderContract {
  execute(): Promise<ContentDatabase>;
}
