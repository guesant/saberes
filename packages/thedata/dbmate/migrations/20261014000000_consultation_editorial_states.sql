-- migrate:up
ALTER TABLE resources
  ADD COLUMN editorial_status TEXT NOT NULL DEFAULT 'review'
  CHECK (editorial_status IN ('draft', 'review', 'published'));

ALTER TABLE resources
  ADD COLUMN editorial_note TEXT;

ALTER TABLE resources
  ADD COLUMN availability_mode TEXT NOT NULL DEFAULT 'reference'
  CHECK (availability_mode IN ('learning', 'practice', 'consultation_only', 'reference'));

-- migrate:down
ALTER TABLE resources DROP COLUMN availability_mode;
ALTER TABLE resources DROP COLUMN editorial_note;
ALTER TABLE resources DROP COLUMN editorial_status;
