import { mapTopicDetailsReadModel } from "./map-topic-details-read-model.function";
import { mapTopicLessonReadModel } from "./map-topic-lesson-read-model.function";
import { mapTopicNavigationReadModel } from "./map-topic-navigation-read-model.function";
import { mapTopicResourceReadModel } from "./map-topic-resource-read-model.function";
import { readTopicQuestions } from "./read-topic-questions.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { TopicReadModel } from "@guesant/saberes-application";

export function readContentTopic(db: ContentDatabase, slug: string): TopicReadModel | null {
  const row = db.get("SELECT * FROM topics WHERE slug = ?", [slug]);

  if (!row) {
    return null;
  }

  return {
    topic: mapTopicDetailsReadModel(row),
    children: db.query("SELECT slug, name, description FROM topics WHERE parent_id = ? ORDER BY name", [row.id])
      .map(mapTopicNavigationReadModel),
    lessons: db.query("SELECT DISTINCT l.id, l.slug, l.title, l.intro description FROM lessons l JOIN lesson_topics lt ON lt.lesson_id = l.id LEFT JOIN curriculum_topics ct ON ct.id = lt.curriculum_topic_id WHERE l.is_published = 1 AND (lt.topic_id = ? OR ct.topic_id = ?) ORDER BY l.title", [row.id, row.id])
      .map(mapTopicLessonReadModel),
    questions: readTopicQuestions(db, Number(row.id)),
    prerequisites: db.query("SELECT t.slug, t.name, t.description, tr.note FROM topic_relations tr JOIN topics t ON t.id = tr.related_topic_id WHERE tr.topic_id = ? AND tr.relation_type = 'prerequisite' ORDER BY t.name", [row.id])
      .map(mapTopicNavigationReadModel),
    related: db.query("SELECT t.slug, t.name, t.description, tr.relation_type FROM topic_relations tr JOIN topics t ON t.id = tr.related_topic_id WHERE tr.topic_id = ? ORDER BY t.name", [row.id])
      .map(mapTopicNavigationReadModel),
    resources: db.query("SELECT DISTINCT r.* FROM resources r JOIN resource_topics rt ON rt.resource_id = r.id LEFT JOIN curriculum_topics ct ON ct.id = rt.curriculum_topic_id WHERE r.is_published = 1 AND (rt.topic_id = ? OR ct.topic_id = ?) ORDER BY r.title", [row.id, row.id])
      .map(mapTopicResourceReadModel),
  };
}
