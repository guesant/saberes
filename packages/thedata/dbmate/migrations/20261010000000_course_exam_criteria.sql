-- migrate:up
PRAGMA foreign_keys = ON;

CREATE TABLE exam_components (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  component_kind TEXT NOT NULL CHECK (component_kind IN ('subject', 'interdisciplinary', 'specific_skill'))
);

CREATE TABLE course_exam_criteria (
  id INTEGER PRIMARY KEY,
  course_offering_id INTEGER NOT NULL,
  exam_component_id INTEGER NOT NULL,
  criterion_kind TEXT NOT NULL CHECK (criterion_kind IN ('priority', 'second_phase_weight')),
  priority_order INTEGER,
  minimum_score REAL,
  weight INTEGER,
  source_document_id INTEGER NOT NULL,
  source_page INTEGER NOT NULL CHECK (source_page > 0),
  editorial_status TEXT NOT NULL DEFAULT 'draft' CHECK (editorial_status IN ('draft', 'review', 'published')),
  notes TEXT,
  CHECK (
    (criterion_kind = 'priority' AND priority_order > 0 AND weight IS NULL)
    OR (criterion_kind = 'second_phase_weight' AND priority_order IS NULL AND weight IN (1, 2, 3))
  ),
  FOREIGN KEY (course_offering_id) REFERENCES course_offerings (id) ON DELETE CASCADE,
  FOREIGN KEY (exam_component_id) REFERENCES exam_components (id),
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  UNIQUE (course_offering_id, exam_component_id, criterion_kind)
);

CREATE INDEX idx_course_exam_criteria_offering_kind
  ON course_exam_criteria (course_offering_id, criterion_kind, priority_order);
CREATE INDEX idx_course_exam_criteria_source
  ON course_exam_criteria (source_document_id);

-- migrate:down
DROP INDEX IF EXISTS idx_course_exam_criteria_source;
DROP INDEX IF EXISTS idx_course_exam_criteria_offering_kind;
DROP TABLE IF EXISTS course_exam_criteria;
DROP TABLE IF EXISTS exam_components;
