import type { ContentRow } from "./database/content-row.type";

export function getQuestionTrainingEligible(row: ContentRow): boolean | undefined {
  if (row.editorial_status === undefined) {
    return undefined;
  }

  return row.editorial_status === "published" && (!row.occurrence_id || row.occurrence_status === "published");
}
