import type { TrainingScope } from "@guesant/saberes-domain";

export function createTrainingQuestionFilter(
  scope: TrainingScope,
  topicId?: number,
  occurrenceAlias?: "qo",
) {
  const clauses = [
    "q.status = 'published'",
    ...(occurrenceAlias ? ["qo.status = 'published'"] : []),
    `EXISTS (
      SELECT 1 FROM curriculum_topics target_topic
      JOIN curriculum_topic_stages target_stage ON target_stage.curriculum_topic_id = target_topic.id
      JOIN stages target_phase ON target_phase.id = target_stage.stage_id
      JOIN editions target_edition ON target_edition.id = target_phase.edition_id
      JOIN curriculum_topic_canonical_topics target_mapping ON target_mapping.curriculum_topic_id = target_topic.id
      JOIN canonical_topics target_canonical ON target_canonical.id = target_mapping.canonical_topic_id
      WHERE target_edition.slug = ? AND target_phase.slug = ?
        AND target_stage.review_status = 'published'
        AND target_mapping.review_status = 'published'
        AND target_canonical.status = 'published'
        AND (? IS NULL OR target_topic.topic_id = ?)
        AND EXISTS (
          SELECT 1 FROM question_canonical_topics question_mapping
          WHERE question_mapping.question_id = q.id
            AND question_mapping.canonical_topic_id = target_canonical.id
            AND question_mapping.review_status = 'published'
        )
    )`,
  ];

  const params: unknown[] = [
    scope.targetEditionSlug,
    scope.targetStageSlug,
    topicId ?? null,
    topicId ?? null,
  ];

  if (scope.sourceEditionSlug || scope.sourceStageSlug) {
    clauses.push(`EXISTS (
      SELECT 1 FROM question_occurrences scoped_occurrence
      JOIN papers scoped_paper ON scoped_paper.id = scoped_occurrence.paper_id
      JOIN stages scoped_stage ON scoped_stage.id = scoped_paper.stage_id
      JOIN editions scoped_edition ON scoped_edition.id = scoped_stage.edition_id
      WHERE scoped_occurrence.question_id = q.id
        AND scoped_occurrence.status = 'published'
        ${occurrenceAlias ? `AND scoped_occurrence.id = ${occurrenceAlias}.id` : ""}
        AND (? IS NULL OR scoped_edition.slug = ?)
        AND (? IS NULL OR scoped_stage.slug = ?)
    )`);

    params.push(
      scope.sourceEditionSlug ?? null,
      scope.sourceEditionSlug ?? null,
      scope.sourceStageSlug ?? null,
      scope.sourceStageSlug ?? null,
    );
  }

  if (scope.subjectSlug) {
    clauses.push(`EXISTS (
      SELECT 1 FROM question_subjects qs JOIN subjects s ON s.id = qs.subject_id
      WHERE qs.question_id = q.id AND s.slug = ?
    )`);

    params.push(scope.subjectSlug);
  }

  if (scope.skillSlug) {
    clauses.push(`EXISTS (
      SELECT 1 FROM question_skills qsk JOIN skills sk ON sk.id = qsk.skill_id
      WHERE qsk.question_id = q.id AND sk.slug = ? AND sk.is_published = 1
    )`);

    params.push(scope.skillSlug);
  }

  if (scope.difficulty) {
    clauses.push("q.difficulty = ?");

    params.push(scope.difficulty);
  }

  return { sql: clauses.join(" AND "), params };
}
