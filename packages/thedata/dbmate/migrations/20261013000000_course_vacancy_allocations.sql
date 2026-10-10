-- migrate:up
PRAGMA foreign_keys = ON;

CREATE TABLE course_vacancy_allocations (
  id INTEGER PRIMARY KEY,
  course_offering_id INTEGER NOT NULL,
  allocation_kind TEXT NOT NULL CHECK (allocation_kind IN (
    'regular_total', 'vestibular_unicamp_total', 'general_competition_min',
    'general_competition_max', 'pp_reserved_15_percent', 'pp_reserved_27_2_percent',
    'treineiro_simulated_total'
  )),
  seats INTEGER NOT NULL CHECK (seats >= 0),
  source_document_id INTEGER NOT NULL,
  source_page INTEGER NOT NULL CHECK (source_page > 0),
  editorial_status TEXT NOT NULL DEFAULT 'draft' CHECK (editorial_status IN ('draft', 'review', 'published')),
  notes TEXT,
  FOREIGN KEY (course_offering_id) REFERENCES course_offerings (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  UNIQUE (course_offering_id, allocation_kind)
);

CREATE INDEX idx_course_vacancy_allocations_source
  ON course_vacancy_allocations (source_document_id);

-- migrate:down
DROP INDEX IF EXISTS idx_course_vacancy_allocations_source;
DROP TABLE IF EXISTS course_vacancy_allocations;
