import type { ContentRow } from "./database/content-row.type";

export type EditorialState = "draft" | "review" | "published" | "missing";

export function getEditorialState(rows: ContentRow[], column: string): EditorialState {
  if (!rows.length) {
    return "missing";
  }

  if (rows.some((row) => { return row[column] === "published"; })) {
    return "published";
  }

  if (rows.some((row) => { return row[column] === "review"; })) {
    return "review";
  }

  return "draft";
}
