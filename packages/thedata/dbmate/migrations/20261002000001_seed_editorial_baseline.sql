-- migrate:up
INSERT OR IGNORE INTO
  content_releases (version, schema_version, generated_at, notes)
VALUES
  ('editorial-dml-baseline', 4, CURRENT_TIMESTAMP, 'Baseline editorial publicado por migration DML.');

-- migrate:down
DELETE FROM content_releases
WHERE
  version = 'editorial-dml-baseline';
