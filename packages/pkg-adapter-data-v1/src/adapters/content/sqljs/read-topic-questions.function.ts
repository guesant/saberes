import { hasContentTable } from "./has-content-table.function";
import { mapTopicQuestionReadModel } from "./map-topic-question-read-model.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { TopicQuestionReadModel } from "@guesant/saberes-application";

export function readTopicQuestions(db: ContentDatabase, topicId: number): TopicQuestionReadModel[] {
  const rows = db.query("SELECT DISTINCT qo.id, qo.id occurrence_id, qo.number, q.slug, q.statement, q.difficulty FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN question_topics qt ON qt.question_occurrence_id = qo.id JOIN curriculum_topics ct ON ct.id = qt.curriculum_topic_id WHERE q.status = 'published' AND ct.topic_id = ? ORDER BY qo.number", [topicId]);

  if (hasContentTable(db, "canonical_question_topics")) {
    rows.push(...db.query("SELECT q.id, q.slug, q.statement, q.difficulty FROM questions q JOIN canonical_question_topics qt ON qt.question_id = q.id WHERE qt.topic_id = ? AND q.status = 'published' AND NOT EXISTS (SELECT 1 FROM question_occurrences qo WHERE qo.question_id = q.id)", [topicId]));
  }

  return rows.map(mapTopicQuestionReadModel);
}
