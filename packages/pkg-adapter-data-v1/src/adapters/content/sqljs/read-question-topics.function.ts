import { hasContentTable } from "./has-content-table.function";
import { mapQuestionTopicReadModel } from "./map-question-topic-read-model.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { ContentRow } from "./database/content-row.type";
import type { QuestionTopicReadModel } from "@guesant/saberes-application";
import type { TrainingScope } from "@guesant/saberes-domain";

export function readQuestionTopics(db: ContentDatabase, question: ContentRow, scope?: TrainingScope): QuestionTopicReadModel[] {
  if (!hasContentTable(db, "question_canonical_topics") || !hasContentTable(db, "canonical_topic_legacy_topics")) {
    return [];
  }

  const topics = scope
    ? db.query(
      `SELECT DISTINCT t.id topic_id, t.slug, t.name
       FROM question_canonical_topics qct
       JOIN canonical_topic_legacy_topics legacy ON legacy.canonical_topic_id = qct.canonical_topic_id
       JOIN topics t ON t.id = legacy.topic_id
       JOIN curriculum_topic_canonical_topics target_map
         ON target_map.canonical_topic_id = qct.canonical_topic_id
       JOIN curriculum_topic_stages target_stage
         ON target_stage.curriculum_topic_id = target_map.curriculum_topic_id
       JOIN stages st ON st.id = target_stage.stage_id
       JOIN editions e ON e.id = st.edition_id
       WHERE qct.question_id = ? AND qct.review_status = 'published'
         AND target_map.review_status = 'published' AND target_stage.review_status = 'published'
         AND e.slug = ? AND st.slug = ?`,
      [question.question_id, scope.targetEditionSlug, scope.targetStageSlug],
    )
    : db.query(
      `SELECT DISTINCT t.id topic_id, t.slug, t.name
       FROM question_canonical_topics qct
       JOIN canonical_topic_legacy_topics legacy ON legacy.canonical_topic_id = qct.canonical_topic_id
       JOIN topics t ON t.id = legacy.topic_id
       WHERE qct.question_id = ? AND qct.review_status = 'published'`,
      [question.question_id],
    );

  return topics
    .filter((topic, index, values) => {
      return values.findIndex((value) => { return value.topic_id === topic.topic_id; }) === index;
    })
    .map(mapQuestionTopicReadModel);
}
