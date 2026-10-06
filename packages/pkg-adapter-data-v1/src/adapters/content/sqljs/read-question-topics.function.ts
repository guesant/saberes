import { hasContentTable } from "./has-content-table.function";
import { mapQuestionTopicReadModel } from "./map-question-topic-read-model.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { ContentRow } from "./database/content-row.type";
import type { QuestionTopicReadModel } from "@guesant/saberes-application";

export function readQuestionTopics(db: ContentDatabase, question: ContentRow): QuestionTopicReadModel[] {
  const topics = db.query("SELECT DISTINCT t.id topic_id, t.slug, t.name FROM question_topics qt JOIN curriculum_topics ct ON ct.id = qt.curriculum_topic_id JOIN topics t ON t.id = ct.topic_id WHERE qt.question_occurrence_id = ?", [question.occurrence_id || 0]);

  if (hasContentTable(db, "canonical_question_topics")) {
    topics.push(...db.query("SELECT t.id topic_id, t.slug, t.name FROM canonical_question_topics qt JOIN topics t ON t.id = qt.topic_id WHERE qt.question_id = ?", [question.question_id]));
  }

  return topics.filter((topic, index, values) => {
    return values.findIndex((value) => { return value.topic_id === topic.topic_id; }) === index;
  })
    .map(mapQuestionTopicReadModel);
}
