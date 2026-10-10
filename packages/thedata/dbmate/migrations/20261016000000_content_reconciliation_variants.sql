-- migrate:up
CREATE TABLE content_reconciliation_batches (
  id INTEGER PRIMARY KEY,
  source_name TEXT NOT NULL,
  source_path TEXT NOT NULL,
  source_sha256 TEXT NOT NULL,
  target_sha256_before TEXT NOT NULL,
  imported_at TEXT NOT NULL,
  source_row_count INTEGER NOT NULL CHECK (source_row_count >= 0),
  inserted_row_count INTEGER NOT NULL CHECK (inserted_row_count >= 0),
  preserved_variant_count INTEGER NOT NULL CHECK (preserved_variant_count >= 0),
  UNIQUE (source_name, source_sha256)
);

CREATE TABLE content_reconciliation_variants (
  id INTEGER PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES content_reconciliation_batches(id),
  source_table TEXT NOT NULL,
  primary_key_json TEXT NOT NULL,
  main_row_json TEXT NOT NULL,
  source_row_json TEXT NOT NULL,
  different_fields_json TEXT NOT NULL,
  disposition TEXT NOT NULL DEFAULT 'main_remains_active_source_variant_preserved'
    CHECK (disposition = 'main_remains_active_source_variant_preserved'),
  UNIQUE (batch_id, source_table, primary_key_json)
);

CREATE INDEX content_reconciliation_variant_lookup
  ON content_reconciliation_variants (source_table, primary_key_json, batch_id);

PRAGMA user_version = 19;

-- migrate:down
DROP INDEX IF EXISTS content_reconciliation_variant_lookup;
DROP TABLE IF EXISTS content_reconciliation_variants;
DROP TABLE IF EXISTS content_reconciliation_batches;

PRAGMA user_version = 18;
