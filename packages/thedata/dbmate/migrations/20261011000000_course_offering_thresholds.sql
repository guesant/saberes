-- migrate:up
PRAGMA foreign_keys = ON;

CREATE TABLE course_offering_thresholds (
  id INTEGER PRIMARY KEY,
  course_offering_id INTEGER NOT NULL,
  threshold_kind TEXT NOT NULL CHECK (threshold_kind IN ('first_phase_nmo')),
  threshold_value REAL NOT NULL CHECK (threshold_value >= 0),
  source_document_id INTEGER NOT NULL,
  source_page INTEGER NOT NULL CHECK (source_page > 0),
  editorial_status TEXT NOT NULL DEFAULT 'draft' CHECK (editorial_status IN ('draft', 'review', 'published')),
  notes TEXT,
  FOREIGN KEY (course_offering_id) REFERENCES course_offerings (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  UNIQUE (course_offering_id, threshold_kind)
);

CREATE INDEX idx_course_offering_thresholds_source
  ON course_offering_thresholds (source_document_id);

-- NMO applies to the course option as a whole, not independently to each priority exam.
ALTER TABLE course_exam_criteria DROP COLUMN minimum_score;

-- migrate:down
ALTER TABLE course_exam_criteria ADD COLUMN minimum_score REAL;
DROP INDEX IF EXISTS idx_course_offering_thresholds_source;
DROP TABLE IF EXISTS course_offering_thresholds;
