import { getContentIdentifier } from "./get-content-identifier.function";
import { readAssessmentCancelledQuestionPolicy } from "./read-assessment-cancelled-question-policy.function";
import { readAssessmentItems } from "./read-assessment-items.function";
import { readContentQuestion } from "./read-content-question.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { AssessmentReadModel } from "@guesant/saberes-application";

export function readContentAssessment(db: ContentDatabase, key: string): AssessmentReadModel | null {
  const identifier = getContentIdentifier(key);

  const row = db.get("SELECT * FROM assessment_sets WHERE (id = ? OR slug = ?)", [Number(identifier) || 0, identifier]);

  if (!row) {
    return null;
  }

  const items = readAssessmentItems(db, Number(row.id));

  const cancelledQuestionPolicy = readAssessmentCancelledQuestionPolicy(db, row);

  const practiceQuestionKeys = items.filter((item) => {
    const question = readContentQuestion(db, item.questionKey || "");

    return Boolean(question?.question.training_eligible !== false
      && question?.question.answer_status !== "cancelled"
      && question?.question.is_automatically_gradable
      && question.question.correct_answer
      && !item.lesson_id);
  })
    .map((item) => {
      return item.questionKey || "";
    })
    .filter(Boolean);

  const uniquePracticeQuestionKeys = [...new Set(practiceQuestionKeys)];

  const canPractice = items.length > 0 && practiceQuestionKeys.length > 0 && items.every((item) => {
    const question = readContentQuestion(db, item.questionKey || "");

    if (question?.question.answer_status === "cancelled") {
      return cancelledQuestionPolicy === "award_max_points"
        && question.question.editorial_status === "published"
        && question.question.occurrence_status === "published"
        && !item.lesson_id;
    }

    return Boolean(question?.question.training_eligible !== false
      && question?.question.is_automatically_gradable
      && question.question.correct_answer
      && !item.lesson_id);
  });

  const canGradeSimulation = items.length > 0 && items.every((item) => {
    const question = readContentQuestion(db, item.questionKey || "");

    if (question?.question.answer_status === "cancelled") {
      return cancelledQuestionPolicy === "award_max_points"
        && question.question.editorial_status === "published"
        && question.question.occurrence_status === "published"
        && !item.lesson_id;
    }

    return Boolean(question?.question.training_eligible !== false && question?.question.is_automatically_gradable && question.question.correct_answer && !item.lesson_id);
  });

  const expectedCount = Number(row.expected_question_count) || null;

  const isOfficialExam = String(row.kind) === "exam";

  const sourceItems = isOfficialExam && row.paper_id
    ? db.query("SELECT asi.position, asi.item_type, qo.paper_id, qo.paper_version_id, qo.number FROM assessment_set_items asi LEFT JOIN question_occurrences qo ON qo.id = asi.question_occurrence_id WHERE asi.assessment_set_id = ? ORDER BY asi.position", [row.id])
    : [];

  const sourceIsComplete = !isOfficialExam || Boolean(row.stage_id && row.paper_id && row.duration_minutes && expectedCount && sourceItems.length === expectedCount && sourceItems.every((item) => {
    const versionMatches = row.paper_version_id === null || row.paper_version_id === undefined || Number(item.paper_version_id) === Number(row.paper_version_id);

    return item.item_type === "question" && Number(item.paper_id) === Number(row.paper_id) && versionMatches && Number(item.position) === Number(item.number);
  }));

  const canSimulate = Number(row.is_published) === 1 && canGradeSimulation && Number(row.duration_minutes) > 0 && expectedCount !== null && items.length === expectedCount && sourceIsComplete;

  const cancelledQuestionCount = items.filter((item) => {
    return readContentQuestion(db, item.questionKey || "")?.question.answer_status === "cancelled";
  }).length;

  let readinessReason = "";

  if (!canSimulate) {
    readinessReason = "incomplete-assessment";

    if (isOfficialExam && !sourceIsComplete) {
      readinessReason = "official-paper-items-mismatch";
    }

    if (Number(row.is_published) !== 1 || !canGradeSimulation) {
      readinessReason = "editorial-review-or-ungradable-items";
    }
  }

  return { assessment: {
    id: Number(row.id), slug: String(row.slug), title: String(row.title),
    description: String(row.description || ""), kind: String(row.kind),
    duration_minutes: Number(row.duration_minutes) || 0, is_published: Number(row.is_published),
    expected_question_count: expectedCount, canSimulate,
    canPractice: Number(row.is_published) === 1 && canPractice && sourceIsComplete,
    practiceQuestionKeys: uniquePracticeQuestionKeys,
    cancelledQuestionCount,
    cancelledQuestionPolicy,
    readinessReason,
    stage_id: row.stage_id === null || row.stage_id === undefined ? null : Number(row.stage_id),
    paper_id: row.paper_id === null || row.paper_id === undefined ? null : Number(row.paper_id),
    paper_version_id: row.paper_version_id === null || row.paper_version_id === undefined ? null : Number(row.paper_version_id),
  }, items };
}
