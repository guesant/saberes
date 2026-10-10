-- migrate:up
PRAGMA foreign_keys = ON;

CREATE TABLE edition_regulatory_rules (
  id INTEGER PRIMARY KEY,
  edition_id INTEGER NOT NULL,
  stage_id INTEGER,
  rule_key TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  statement TEXT NOT NULL,
  effective_status TEXT NOT NULL,
  editorial_status TEXT NOT NULL DEFAULT 'draft',
  reviewed_at TEXT,
  notes TEXT,
  FOREIGN KEY (edition_id) REFERENCES editions (id) ON DELETE CASCADE,
  FOREIGN KEY (stage_id) REFERENCES stages (id),
  UNIQUE (edition_id, rule_key)
);

CREATE TABLE edition_regulatory_rule_sources (
  rule_id INTEGER NOT NULL,
  source_document_id INTEGER NOT NULL,
  source_location TEXT,
  source_order INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (rule_id, source_document_id, source_order),
  FOREIGN KEY (rule_id) REFERENCES edition_regulatory_rules (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id)
);

CREATE INDEX idx_edition_regulatory_rules_edition_stage
  ON edition_regulatory_rules (edition_id, stage_id, rule_type);

CREATE INDEX idx_edition_regulatory_rule_sources_document
  ON edition_regulatory_rule_sources (source_document_id);

-- migrate:down
DROP TABLE IF EXISTS edition_regulatory_rule_sources;
DROP TABLE IF EXISTS edition_regulatory_rules;
