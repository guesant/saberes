-- migrate:up
PRAGMA foreign_keys = ON;

-- Canonical concepts are stable across editions and admission processes. Annual
-- curriculum labels remain in curriculum_topics and map to these concepts via
-- an explicit many-to-many relation.
CREATE TABLE canonical_topics (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  FOREIGN KEY (parent_id) REFERENCES canonical_topics (id)
);

CREATE TABLE curriculum_topic_canonical_topics (
  curriculum_topic_id INTEGER NOT NULL,
  canonical_topic_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'related' CHECK (relation_type IN ('primary', 'secondary', 'related')),
  confidence REAL CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  source_document_id INTEGER,
  source_page INTEGER CHECK (source_page IS NULL OR source_page > 0),
  source_excerpt TEXT,
  review_status TEXT NOT NULL DEFAULT 'draft' CHECK (review_status IN ('draft', 'review', 'published')),
  PRIMARY KEY (curriculum_topic_id, canonical_topic_id),
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id) ON DELETE CASCADE,
  FOREIGN KEY (canonical_topic_id) REFERENCES canonical_topics (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  CHECK (review_status <> 'published' OR source_document_id IS NOT NULL)
);

CREATE UNIQUE INDEX curriculum_topic_one_primary_canonical_topic
ON curriculum_topic_canonical_topics (curriculum_topic_id)
WHERE relation_type = 'primary';

CREATE TABLE question_canonical_topics (
  question_id INTEGER NOT NULL,
  canonical_topic_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'primary' CHECK (relation_type IN ('primary', 'secondary', 'related')),
  confidence REAL CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  source_document_id INTEGER,
  source_page INTEGER CHECK (source_page IS NULL OR source_page > 0),
  source_excerpt TEXT,
  review_status TEXT NOT NULL DEFAULT 'draft' CHECK (review_status IN ('draft', 'review', 'published')),
  PRIMARY KEY (question_id, canonical_topic_id),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (canonical_topic_id) REFERENCES canonical_topics (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  CHECK (review_status <> 'published' OR source_document_id IS NOT NULL)
);

CREATE UNIQUE INDEX question_one_primary_canonical_topic
ON question_canonical_topics (question_id)
WHERE relation_type = 'primary';

CREATE INDEX curriculum_topic_canonical_topics_canonical_id
ON curriculum_topic_canonical_topics (canonical_topic_id);
CREATE INDEX question_canonical_topics_canonical_id
ON question_canonical_topics (canonical_topic_id);

-- Preserve old topic rows and links. This compatibility bridge lets readers
-- migrate incrementally without reassigning legacy identifiers.
CREATE TABLE canonical_topic_legacy_topics (
  canonical_topic_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL UNIQUE,
  PRIMARY KEY (canonical_topic_id, topic_id),
  FOREIGN KEY (canonical_topic_id) REFERENCES canonical_topics (id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE IF EXISTS canonical_topic_legacy_topics;
DROP INDEX IF EXISTS question_canonical_topics_canonical_id;
DROP INDEX IF EXISTS curriculum_topic_canonical_topics_canonical_id;
DROP INDEX IF EXISTS question_one_primary_canonical_topic;
DROP TABLE IF EXISTS question_canonical_topics;
DROP INDEX IF EXISTS curriculum_topic_one_primary_canonical_topic;
DROP TABLE IF EXISTS curriculum_topic_canonical_topics;
DROP TABLE IF EXISTS canonical_topics;
