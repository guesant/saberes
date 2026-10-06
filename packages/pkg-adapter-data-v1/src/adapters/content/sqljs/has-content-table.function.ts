import type { ContentDatabase } from "./database/content-database.type";

export function hasContentTable(db: ContentDatabase, table: string): boolean {
  return Boolean(db.get("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?", [table]));
}
