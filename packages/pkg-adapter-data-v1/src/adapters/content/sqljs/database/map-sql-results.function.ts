import type { ContentRow } from "./content-row.type";
import type { SqlResult } from "./sql-result.type";

export function mapSqlResults(result: SqlResult[] | undefined): ContentRow[] {
  if (!result?.[0]) {
    return [];
  }

  const { columns, values } = result[0];

  return values.map((value) => {
    return Object.fromEntries(
      columns.map((column, index) => {
        return [column, value[index]];
      }),
    );
  });
}
