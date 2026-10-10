-- migrate:up
ALTER TABLE question_solutions
  ADD COLUMN editorial_status TEXT NOT NULL DEFAULT 'review'
  CHECK (editorial_status IN ('draft', 'review', 'published'));

ALTER TABLE question_solutions ADD COLUMN editorial_version TEXT;
ALTER TABLE question_solutions ADD COLUMN authorship TEXT;

-- Existing editorial content predates explicit workflow tracking. Preserve its
-- current availability, while new inserts default to review until approved.
UPDATE question_solutions SET editorial_status = 'published';

PRAGMA user_version = 20;

-- migrate:down
ALTER TABLE question_solutions DROP COLUMN authorship;
ALTER TABLE question_solutions DROP COLUMN editorial_version;
ALTER TABLE question_solutions DROP COLUMN editorial_status;

PRAGMA user_version = 19;
