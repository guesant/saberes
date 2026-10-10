-- migrate:up
PRAGMA foreign_keys = ON;

CREATE TABLE required_reading_works (
  id INTEGER PRIMARY KEY,
  curriculum_id INTEGER NOT NULL,
  curriculum_topic_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  literary_genre TEXT NOT NULL,
  reading_scope TEXT NOT NULL CHECK (reading_scope IN ('complete_work', 'selected_texts')),
  selected_texts_json TEXT,
  position INTEGER NOT NULL CHECK (position > 0),
  source_document_id INTEGER NOT NULL,
  source_location TEXT NOT NULL,
  source_excerpt TEXT NOT NULL,
  editorial_status TEXT NOT NULL DEFAULT 'review' CHECK (editorial_status IN ('draft', 'review', 'published')),
  FOREIGN KEY (curriculum_id) REFERENCES curricula (id) ON DELETE CASCADE,
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  UNIQUE (curriculum_id, slug),
  UNIQUE (curriculum_id, position),
  CHECK (
    (reading_scope = 'complete_work' AND selected_texts_json IS NULL)
    OR (reading_scope = 'selected_texts' AND selected_texts_json IS NOT NULL)
  )
);

CREATE TABLE required_reading_resources (
  required_reading_work_id INTEGER NOT NULL,
  resource_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('official_lesson', 'public_full_text', 'study_material', 'practice')),
  source_document_id INTEGER NOT NULL,
  editorial_status TEXT NOT NULL DEFAULT 'review' CHECK (editorial_status IN ('draft', 'review', 'published')),
  PRIMARY KEY (required_reading_work_id, resource_id, relation_type),
  FOREIGN KEY (required_reading_work_id) REFERENCES required_reading_works (id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id)
);

CREATE INDEX required_reading_works_source_document_id ON required_reading_works (source_document_id);
CREATE INDEX required_reading_resources_resource_id ON required_reading_resources (resource_id);

-- migrate:down
DROP TABLE IF EXISTS required_reading_resources;
DROP TABLE IF EXISTS required_reading_works;
