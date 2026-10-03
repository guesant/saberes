import type { ContentRow, SqlResult } from "./content-database.types";

export function mapSqlResults(result: SqlResult[] | undefined): ContentRow[] {
  if (!result?.[0]) {
    return [];
  }

  const { columns, values } = result[0];

  return values.map((value) =>
    Object.fromEntries(columns.map((column, index) => [column, value[index]])),
  );
}
