import type { ContentDatabase } from "./database/content-database.type";

export function hasContentColumn(db: ContentDatabase, table: string, column: string): boolean {
  return Boolean(db.get("SELECT name FROM pragma_table_info(?) WHERE name = ?", [table, column]));
}
