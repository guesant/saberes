import { mapQuestionDetailsReadModel } from "./map-question-details-read-model.function";
import { mapQuestionPartReadModel } from "./map-question-part-read-model.function";
import { mapTopicQuestionReadModel } from "./map-topic-question-read-model.function";
import { readQuestionAnswer } from "./read-question-answer.function";
import { readQuestionOptions } from "./read-question-options.function";
import { readQuestionRow } from "./read-question-row.function";
import { readQuestionTopics } from "./read-question-topics.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { QuestionReadModel } from "@guesant/saberes-application";

export function readContentQuestion(db: ContentDatabase, key: string): QuestionReadModel | null {
  const row = readQuestionRow(db, key);

  if (!row) {
    return null;
  }

  return {
    question: mapQuestionDetailsReadModel({ ...row, ...readQuestionAnswer(db, row) }),
    options: readQuestionOptions(db, row),
    parts: db.query("SELECT * FROM question_parts WHERE question_id = ? ORDER BY position", [row.question_id])
      .map(mapQuestionPartReadModel),
    topics: readQuestionTopics(db, row),
    related: db.query("SELECT DISTINCT qo2.id, qo2.id occurrence_id, qo2.number, q.slug, q.statement, q.difficulty FROM question_topics qt1 JOIN question_topics qt2 ON qt2.curriculum_topic_id = qt1.curriculum_topic_id JOIN question_occurrences qo2 ON qo2.id = qt2.question_occurrence_id JOIN questions q ON q.id = qo2.question_id WHERE qt1.question_occurrence_id = ? AND qo2.id <> ? AND q.status = 'published' LIMIT 4", [row.occurrence_id || 0, row.occurrence_id || 0])
      .map(mapTopicQuestionReadModel),
    contexts: [],
  };
}
