import type { ContentRow } from "./content-row.type.ts";

export type ContentDatabase = {
  source: string;
  query(sql: string, params?: unknown[]): ContentRow[];

  get(sql: string, params?: unknown[]): ContentRow | null;
};
