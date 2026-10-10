import { hasContentTable } from "./has-content-table.function";
import type { ContentDatabase } from "./database/content-database.type";

export function readAssessmentCancelledQuestionPolicy(
  db: ContentDatabase,
  assessment: Record<string, unknown>,
): "award_max_points" | undefined {
  if (!hasContentTable(db, "scoring_rules")
    || assessment.stage_id === null || assessment.stage_id === undefined
    || assessment.paper_id === null || assessment.paper_id === undefined) {
    return undefined;
  }

  const rules = db.query(
    "SELECT metadata_json FROM scoring_rules WHERE stage_id = ? AND paper_id = ?",
    [assessment.stage_id, assessment.paper_id],
  );

  if (rules.length !== 1 || typeof rules[0]?.metadata_json !== "string") {
    return undefined;
  }

  try {
    const metadata: unknown = JSON.parse(String(rules[0].metadata_json));

    if (typeof metadata === "object" && metadata !== null && "cancelled_question_policy" in metadata
      && metadata.cancelled_question_policy === "award_max_points") {
      return "award_max_points";
    }

    return undefined;
  } catch {
    return undefined;
  }
}
