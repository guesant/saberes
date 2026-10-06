import { hasContentColumn } from "./has-content-column.function";
import { mapAssessmentItemReadModel } from "./map-assessment-item-read-model.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { AssessmentItemReadModel } from "@guesant/saberes-application";

export function readAssessmentItems(db: ContentDatabase, id: number): AssessmentItemReadModel[] {
  if (hasContentColumn(db, "assessment_set_items", "question_id")) {
    return db.query("SELECT asi.*, q.slug question_slug, q.statement FROM assessment_set_items asi LEFT JOIN question_occurrences qo ON qo.id = asi.question_occurrence_id LEFT JOIN questions q ON q.id = COALESCE(asi.question_id, qo.question_id) WHERE asi.assessment_set_id = ? ORDER BY asi.position", [id])
      .map(mapAssessmentItemReadModel);
  }

  return db.query("SELECT asi.*, q.slug question_slug, q.statement FROM assessment_set_items asi LEFT JOIN question_occurrences qo ON qo.id = asi.question_occurrence_id LEFT JOIN questions q ON q.id = qo.question_id WHERE asi.assessment_set_id = ? ORDER BY asi.position", [id])
    .map(mapAssessmentItemReadModel);
}
