import { getContentIdentifier } from "./get-content-identifier.function";
import { readAssessmentItems } from "./read-assessment-items.function";
import { readContentQuestion } from "./read-content-question.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { AssessmentReadModel } from "@guesant/saberes-application";

export function readContentAssessment(db: ContentDatabase, key: string): AssessmentReadModel | null {
  const identifier = getContentIdentifier(key);

  const row = db.get("SELECT * FROM assessment_sets WHERE is_published = 1 AND (id = ? OR slug = ?)", [Number(identifier) || 0, identifier]);

  if (!row) {
    return null;
  }

  const items = readAssessmentItems(db, Number(row.id));

  const canGrade = items.length > 0 && items.every((item) => {
    const question = readContentQuestion(db, item.questionKey || "");

    return Boolean(question?.question.is_automatically_gradable && question.question.correct_answer && !item.lesson_id);
  });

  const expectedCount = Number(row.expected_question_count) || null;

  const canSimulate = canGrade && Number(row.duration_minutes) > 0 && expectedCount !== null && items.length === expectedCount;

  return { assessment: {
    id: Number(row.id), slug: String(row.slug), title: String(row.title),
    description: String(row.description || ""), kind: String(row.kind),
    duration_minutes: Number(row.duration_minutes) || 0, is_published: Number(row.is_published),
    expected_question_count: expectedCount, canSimulate,
    readinessReason: canSimulate ? "" : "incomplete-assessment",
  }, items };
}
