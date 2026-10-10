-- migrate:up
PRAGMA foreign_keys = ON;

ALTER TABLE source_documents
ADD COLUMN reuse_status TEXT NOT NULL DEFAULT 'unknown'
CHECK (reuse_status IN ('unknown', 'link_only', 'open_license', 'public_domain', 'permission_confirmed'));

ALTER TABLE source_documents ADD COLUMN license_name TEXT;
ALTER TABLE source_documents ADD COLUMN license_url TEXT;
ALTER TABLE source_documents ADD COLUMN attribution TEXT;
ALTER TABLE source_documents ADD COLUMN rights_note TEXT;

ALTER TABLE resource_topics
ADD COLUMN review_status TEXT NOT NULL DEFAULT 'review'
CHECK (review_status IN ('draft', 'review', 'published'));

ALTER TABLE resource_topics
ADD COLUMN relevance_status TEXT NOT NULL DEFAULT 'unknown'
CHECK (relevance_status IN ('unknown', 'relevant', 'not_relevant'));

ALTER TABLE resource_topics
ADD COLUMN accessibility_status TEXT NOT NULL DEFAULT 'unknown'
CHECK (accessibility_status IN ('unknown', 'checked', 'needs_improvement'));

ALTER TABLE resource_topics ADD COLUMN review_note TEXT;

CREATE INDEX curriculum_topic_canonical_review_lookup
ON curriculum_topic_canonical_topics (canonical_topic_id, review_status, curriculum_topic_id);

CREATE INDEX question_canonical_review_lookup
ON question_canonical_topics (canonical_topic_id, review_status, question_id);

CREATE INDEX curriculum_stage_review_lookup
ON curriculum_topic_stages (stage_id, review_status, curriculum_topic_id);

CREATE INDEX resource_topic_review_lookup
ON resource_topics (curriculum_topic_id, review_status, relevance_status, resource_id);

-- migrate:down
DROP INDEX IF EXISTS resource_topic_review_lookup;
DROP INDEX IF EXISTS curriculum_stage_review_lookup;
DROP INDEX IF EXISTS question_canonical_review_lookup;
DROP INDEX IF EXISTS curriculum_topic_canonical_review_lookup;

ALTER TABLE resource_topics DROP COLUMN review_note;
ALTER TABLE resource_topics DROP COLUMN accessibility_status;
ALTER TABLE resource_topics DROP COLUMN relevance_status;
ALTER TABLE resource_topics DROP COLUMN review_status;

ALTER TABLE source_documents DROP COLUMN rights_note;
ALTER TABLE source_documents DROP COLUMN attribution;
ALTER TABLE source_documents DROP COLUMN license_url;
ALTER TABLE source_documents DROP COLUMN license_name;
ALTER TABLE source_documents DROP COLUMN reuse_status;
