-- migrate:up
PRAGMA foreign_keys = ON;

CREATE TABLE canonical_question_topics (
  question_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'primary',
  confidence REAL CHECK (
    confidence IS NULL
    OR (
      confidence >= 0
      AND confidence <= 1
    )
  ),
  PRIMARY KEY (question_id, topic_id),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
);

CREATE TABLE stimuli (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  content_format TEXT NOT NULL DEFAULT 'markdown' CHECK (content_format IN ('markdown', 'plain_text')),
  source_document_id INTEGER,
  source_page INTEGER CHECK (
    source_page IS NULL
    OR source_page > 0
  ),
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id)
);

CREATE TABLE content_assets (
  id INTEGER PRIMARY KEY,
  path TEXT UNIQUE NOT NULL,
  media_type TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  source_document_id INTEGER,
  checksum TEXT,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id)
);

CREATE TABLE question_stimuli (
  question_id INTEGER NOT NULL,
  stimulus_id INTEGER NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  PRIMARY KEY (question_id, stimulus_id),
  UNIQUE (question_id, position),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (stimulus_id) REFERENCES stimuli (id)
);

CREATE TABLE stimulus_assets (
  stimulus_id INTEGER NOT NULL,
  asset_id INTEGER NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  PRIMARY KEY (stimulus_id, asset_id),
  UNIQUE (stimulus_id, position),
  FOREIGN KEY (stimulus_id) REFERENCES stimuli (id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES content_assets (id)
);

CREATE TABLE question_assets (
  question_id INTEGER NOT NULL,
  asset_id INTEGER NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  PRIMARY KEY (question_id, asset_id),
  UNIQUE (question_id, position),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES content_assets (id)
);

CREATE TABLE question_occurrence_options (
  occurrence_id INTEGER NOT NULL,
  question_option_id INTEGER NOT NULL,
  code TEXT NOT NULL CHECK (length(trim(code)) > 0),
  position INTEGER NOT NULL CHECK (position >= 0),
  PRIMARY KEY (occurrence_id, question_option_id),
  UNIQUE (occurrence_id, code),
  UNIQUE (occurrence_id, position),
  FOREIGN KEY (occurrence_id) REFERENCES question_occurrences (id) ON DELETE CASCADE,
  FOREIGN KEY (question_option_id) REFERENCES question_options (id)
);

CREATE TABLE canonical_answer_keys (
  id INTEGER PRIMARY KEY,
  question_id INTEGER NOT NULL,
  occurrence_id INTEGER,
  question_part_id INTEGER,
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  status TEXT NOT NULL DEFAULT 'definitive' CHECK (status IN ('provisional', 'definitive', 'cancelled')),
  answer_type TEXT NOT NULL,
  answer_value TEXT,
  explanation TEXT,
  is_automatically_gradable INTEGER NOT NULL DEFAULT 0 CHECK (is_automatically_gradable IN (0, 1)),
  max_points REAL CHECK (
    max_points IS NULL
    OR max_points >= 0
  ),
  source_document_id INTEGER,
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (occurrence_id) REFERENCES question_occurrences (id) ON DELETE CASCADE,
  FOREIGN KEY (question_part_id) REFERENCES question_parts (id),
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  CHECK (
    status <> 'cancelled'
    OR is_automatically_gradable = 0
  )
);

CREATE UNIQUE INDEX canonical_answer_keys_question_version ON canonical_answer_keys (question_id, version)
WHERE
  occurrence_id IS NULL
  AND question_part_id IS NULL;

CREATE UNIQUE INDEX canonical_answer_keys_occurrence_version ON canonical_answer_keys (question_id, occurrence_id, version)
WHERE
  occurrence_id IS NOT NULL
  AND question_part_id IS NULL;

CREATE UNIQUE INDEX canonical_answer_keys_part_version ON canonical_answer_keys (question_id, question_part_id, version)
WHERE
  occurrence_id IS NULL
  AND question_part_id IS NOT NULL;

CREATE UNIQUE INDEX canonical_answer_keys_occurrence_part_version ON canonical_answer_keys (question_id, occurrence_id, question_part_id, version)
WHERE
  occurrence_id IS NOT NULL
  AND question_part_id IS NOT NULL;

CREATE TABLE canonical_answer_key_options (
  answer_key_id INTEGER NOT NULL,
  question_option_id INTEGER NOT NULL,
  PRIMARY KEY (answer_key_id, question_option_id),
  FOREIGN KEY (answer_key_id) REFERENCES canonical_answer_keys (id) ON DELETE CASCADE,
  FOREIGN KEY (question_option_id) REFERENCES question_options (id)
);

ALTER TABLE assessment_set_items
ADD COLUMN question_id INTEGER REFERENCES questions (id);

ALTER TABLE assessment_sets
ADD COLUMN expected_question_count INTEGER CHECK (
  expected_question_count IS NULL
  OR expected_question_count > 0
);

ALTER TABLE learning_course_items
ADD COLUMN question_id INTEGER REFERENCES questions (id);

CREATE UNIQUE INDEX question_occurrences_unversioned_number ON question_occurrences (paper_id, number)
WHERE
  paper_version_id IS NULL;

CREATE UNIQUE INDEX course_offerings_unclassified ON course_offerings (edition_id, degree_program_id)
WHERE
  modality_id IS NULL;

CREATE UNIQUE INDEX course_stage_requirements_whole_stage ON course_stage_requirements (course_offering_id, stage_id)
WHERE
  paper_id IS NULL;

CREATE UNIQUE INDEX lesson_topics_canonical ON lesson_topics (lesson_id, topic_id)
WHERE
  curriculum_topic_id IS NULL;

CREATE UNIQUE INDEX lesson_topics_curriculum ON lesson_topics (lesson_id, curriculum_topic_id)
WHERE
  topic_id IS NULL;

CREATE UNIQUE INDEX resource_topics_canonical ON resource_topics (resource_id, topic_id)
WHERE
  curriculum_topic_id IS NULL;

CREATE UNIQUE INDEX resource_topics_curriculum ON resource_topics (resource_id, curriculum_topic_id)
WHERE
  topic_id IS NULL;

CREATE UNIQUE INDEX learning_course_targets_process ON learning_course_targets (learning_course_id, admission_process_id)
WHERE
  edition_id IS NULL;

CREATE UNIQUE INDEX learning_course_targets_edition ON learning_course_targets (learning_course_id, edition_id)
WHERE
  admission_process_id IS NULL;

CREATE TRIGGER assessment_set_items_integrity_insert BEFORE INSERT ON assessment_set_items WHEN (
  (NEW.question_id IS NOT NULL) + (NEW.question_occurrence_id IS NOT NULL) + (NEW.lesson_id IS NOT NULL)
) <> 1
OR NOT (
  (
    NEW.item_type = 'question'
    AND (
      NEW.question_id IS NOT NULL
      OR NEW.question_occurrence_id IS NOT NULL
    )
  )
  OR (
    NEW.item_type = 'lesson'
    AND NEW.lesson_id IS NOT NULL
  )
) BEGIN
SELECT
  RAISE (ABORT, 'assessment item requires exactly one compatible target');

END;

CREATE TRIGGER assessment_set_items_integrity_update BEFORE
UPDATE ON assessment_set_items WHEN (
  (NEW.question_id IS NOT NULL) + (NEW.question_occurrence_id IS NOT NULL) + (NEW.lesson_id IS NOT NULL)
) <> 1
OR NOT (
  (
    NEW.item_type = 'question'
    AND (
      NEW.question_id IS NOT NULL
      OR NEW.question_occurrence_id IS NOT NULL
    )
  )
  OR (
    NEW.item_type = 'lesson'
    AND NEW.lesson_id IS NOT NULL
  )
) BEGIN
SELECT
  RAISE (ABORT, 'assessment item requires exactly one compatible target');

END;

CREATE TRIGGER learning_course_items_integrity_insert BEFORE INSERT ON learning_course_items WHEN (
  (NEW.question_id IS NOT NULL) + (NEW.question_occurrence_id IS NOT NULL) + (NEW.lesson_id IS NOT NULL) + (NEW.assessment_set_id IS NOT NULL)
) <> 1
OR NOT (
  (
    NEW.item_type IN ('question', 'practice')
    AND (
      NEW.question_id IS NOT NULL
      OR NEW.question_occurrence_id IS NOT NULL
    )
  )
  OR (
    NEW.item_type = 'lesson'
    AND NEW.lesson_id IS NOT NULL
  )
  OR (
    NEW.item_type = 'assessment'
    AND NEW.assessment_set_id IS NOT NULL
  )
) BEGIN
SELECT
  RAISE (ABORT, 'learning item requires exactly one compatible target');

END;

CREATE TRIGGER learning_course_items_integrity_update BEFORE
UPDATE ON learning_course_items WHEN (
  (NEW.question_id IS NOT NULL) + (NEW.question_occurrence_id IS NOT NULL) + (NEW.lesson_id IS NOT NULL) + (NEW.assessment_set_id IS NOT NULL)
) <> 1
OR NOT (
  (
    NEW.item_type IN ('question', 'practice')
    AND (
      NEW.question_id IS NOT NULL
      OR NEW.question_occurrence_id IS NOT NULL
    )
  )
  OR (
    NEW.item_type = 'lesson'
    AND NEW.lesson_id IS NOT NULL
  )
  OR (
    NEW.item_type = 'assessment'
    AND NEW.assessment_set_id IS NOT NULL
  )
) BEGIN
SELECT
  RAISE (ABORT, 'learning item requires exactly one compatible target');

END;

CREATE TRIGGER question_occurrences_integrity_insert BEFORE INSERT ON question_occurrences WHEN NEW.paper_version_id IS NOT NULL
AND NOT EXISTS (
  SELECT
    1
  FROM
    paper_versions
  WHERE
    id = NEW.paper_version_id
    AND paper_id = NEW.paper_id
) BEGIN
SELECT
  RAISE (ABORT, 'occurrence version belongs to another paper');

END;

CREATE TRIGGER question_occurrences_integrity_update BEFORE
UPDATE ON question_occurrences WHEN NEW.paper_version_id IS NOT NULL
AND NOT EXISTS (
  SELECT
    1
  FROM
    paper_versions
  WHERE
    id = NEW.paper_version_id
    AND paper_id = NEW.paper_id
) BEGIN
SELECT
  RAISE (ABORT, 'occurrence version belongs to another paper');

END;

CREATE TRIGGER question_occurrence_options_integrity_insert BEFORE INSERT ON question_occurrence_options WHEN NOT EXISTS (
  SELECT
    1
  FROM
    question_occurrences qo
    JOIN question_options opt ON opt.question_id = qo.question_id
  WHERE
    qo.id = NEW.occurrence_id
    AND opt.id = NEW.question_option_id
) BEGIN
SELECT
  RAISE (ABORT, 'occurrence option belongs to another question');

END;

CREATE TRIGGER question_occurrence_options_integrity_update BEFORE
UPDATE ON question_occurrence_options WHEN NOT EXISTS (
  SELECT
    1
  FROM
    question_occurrences qo
    JOIN question_options opt ON opt.question_id = qo.question_id
  WHERE
    qo.id = NEW.occurrence_id
    AND opt.id = NEW.question_option_id
) BEGIN
SELECT
  RAISE (ABORT, 'occurrence option belongs to another question');

END;

CREATE TRIGGER canonical_answer_keys_integrity_insert BEFORE INSERT ON canonical_answer_keys WHEN (
  NEW.occurrence_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      question_occurrences
    WHERE
      id = NEW.occurrence_id
      AND question_id = NEW.question_id
  )
)
OR (
  NEW.question_part_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      question_parts
    WHERE
      id = NEW.question_part_id
      AND question_id = NEW.question_id
  )
)
OR EXISTS (
  SELECT
    1
  FROM
    canonical_answer_key_options ako
    JOIN question_options opt ON opt.id = ako.question_option_id
  WHERE
    ako.answer_key_id = NEW.id
    AND opt.question_id <> NEW.question_id
) BEGIN
SELECT
  RAISE (ABORT, 'canonical answer scope belongs to another question');

END;

CREATE TRIGGER canonical_answer_keys_integrity_update BEFORE
UPDATE ON canonical_answer_keys WHEN (
  NEW.occurrence_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      question_occurrences
    WHERE
      id = NEW.occurrence_id
      AND question_id = NEW.question_id
  )
)
OR (
  NEW.question_part_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      question_parts
    WHERE
      id = NEW.question_part_id
      AND question_id = NEW.question_id
  )
)
OR EXISTS (
  SELECT
    1
  FROM
    canonical_answer_key_options ako
    JOIN question_options opt ON opt.id = ako.question_option_id
  WHERE
    ako.answer_key_id = NEW.id
    AND opt.question_id <> NEW.question_id
) BEGIN
SELECT
  RAISE (ABORT, 'canonical answer scope belongs to another question');

END;

CREATE TRIGGER canonical_answer_key_options_integrity_insert BEFORE INSERT ON canonical_answer_key_options WHEN NOT EXISTS (
  SELECT
    1
  FROM
    canonical_answer_keys ak
    JOIN question_options opt ON opt.question_id = ak.question_id
  WHERE
    ak.id = NEW.answer_key_id
    AND opt.id = NEW.question_option_id
)
OR EXISTS (
  SELECT
    1
  FROM
    canonical_answer_keys
  WHERE
    id = NEW.answer_key_id
    AND status = 'cancelled'
) BEGIN
SELECT
  RAISE (ABORT, 'canonical answer option has incompatible owner or status');

END;

CREATE TRIGGER canonical_answer_key_options_integrity_update BEFORE
UPDATE ON canonical_answer_key_options WHEN NOT EXISTS (
  SELECT
    1
  FROM
    canonical_answer_keys ak
    JOIN question_options opt ON opt.question_id = ak.question_id
  WHERE
    ak.id = NEW.answer_key_id
    AND opt.id = NEW.question_option_id
)
OR EXISTS (
  SELECT
    1
  FROM
    canonical_answer_keys
  WHERE
    id = NEW.answer_key_id
    AND status = 'cancelled'
) BEGIN
SELECT
  RAISE (ABORT, 'canonical answer option has incompatible owner or status');

END;

CREATE TRIGGER answer_keys_integrity_insert BEFORE INSERT ON answer_keys WHEN (
  NEW.question_part_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      question_occurrences qo
      JOIN question_parts qp ON qp.question_id = qo.question_id
    WHERE
      qo.id = NEW.question_occurrence_id
      AND qp.id = NEW.question_part_id
  )
)
OR EXISTS (
  SELECT
    1
  FROM
    answer_key_options ako
    JOIN question_options opt ON opt.id = ako.question_option_id
    JOIN question_occurrences qo ON qo.id = NEW.question_occurrence_id
  WHERE
    ako.answer_key_id = NEW.id
    AND opt.question_id <> qo.question_id
) BEGIN
SELECT
  RAISE (ABORT, 'legacy answer scope belongs to another question');

END;

CREATE TRIGGER answer_keys_integrity_update BEFORE
UPDATE ON answer_keys WHEN (
  NEW.question_part_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      question_occurrences qo
      JOIN question_parts qp ON qp.question_id = qo.question_id
    WHERE
      qo.id = NEW.question_occurrence_id
      AND qp.id = NEW.question_part_id
  )
)
OR EXISTS (
  SELECT
    1
  FROM
    answer_key_options ako
    JOIN question_options opt ON opt.id = ako.question_option_id
    JOIN question_occurrences qo ON qo.id = NEW.question_occurrence_id
  WHERE
    ako.answer_key_id = NEW.id
    AND opt.question_id <> qo.question_id
) BEGIN
SELECT
  RAISE (ABORT, 'legacy answer scope belongs to another question');

END;

CREATE TRIGGER answer_key_options_integrity_insert BEFORE INSERT ON answer_key_options WHEN NOT EXISTS (
  SELECT
    1
  FROM
    answer_keys ak
    JOIN question_occurrences qo ON qo.id = ak.question_occurrence_id
    JOIN question_options opt ON opt.question_id = qo.question_id
  WHERE
    ak.id = NEW.answer_key_id
    AND opt.id = NEW.question_option_id
) BEGIN
SELECT
  RAISE (ABORT, 'legacy answer option belongs to another question');

END;

CREATE TRIGGER answer_key_options_integrity_update BEFORE
UPDATE ON answer_key_options WHEN NOT EXISTS (
  SELECT
    1
  FROM
    answer_keys ak
    JOIN question_occurrences qo ON qo.id = ak.question_occurrence_id
    JOIN question_options opt ON opt.question_id = qo.question_id
  WHERE
    ak.id = NEW.answer_key_id
    AND opt.id = NEW.question_option_id
) BEGIN
SELECT
  RAISE (ABORT, 'legacy answer option belongs to another question');

END;

CREATE TRIGGER curriculum_topics_integrity_insert BEFORE INSERT ON curriculum_topics WHEN NEW.parent_id = NEW.id
OR (
  NEW.parent_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      curriculum_topics
    WHERE
      id = NEW.parent_id
      AND curriculum_id = NEW.curriculum_id
  )
)
OR EXISTS (
  SELECT
    1
  FROM
    curriculum_topics
  WHERE
    parent_id = NEW.id
    AND curriculum_id <> NEW.curriculum_id
)
OR EXISTS (
  SELECT
    1
  FROM
    lesson_topics
  WHERE
    curriculum_topic_id = NEW.id
    AND topic_id IS NOT NULL
    AND topic_id <> NEW.topic_id
)
OR EXISTS (
  SELECT
    1
  FROM
    resource_topics
  WHERE
    curriculum_topic_id = NEW.id
    AND topic_id IS NOT NULL
    AND topic_id <> NEW.topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'curriculum topic has incompatible parent or canonical topic');

END;

CREATE TRIGGER curriculum_topics_integrity_update BEFORE
UPDATE ON curriculum_topics WHEN NEW.parent_id = NEW.id
OR (
  NEW.parent_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      curriculum_topics
    WHERE
      id = NEW.parent_id
      AND curriculum_id = NEW.curriculum_id
  )
)
OR EXISTS (
  SELECT
    1
  FROM
    curriculum_topics
  WHERE
    parent_id = NEW.id
    AND curriculum_id <> NEW.curriculum_id
)
OR EXISTS (
  SELECT
    1
  FROM
    lesson_topics
  WHERE
    curriculum_topic_id = NEW.id
    AND topic_id IS NOT NULL
    AND topic_id <> NEW.topic_id
)
OR EXISTS (
  SELECT
    1
  FROM
    resource_topics
  WHERE
    curriculum_topic_id = NEW.id
    AND topic_id IS NOT NULL
    AND topic_id <> NEW.topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'curriculum topic has incompatible parent or canonical topic');

END;

CREATE TRIGGER lesson_topics_integrity_insert BEFORE INSERT ON lesson_topics WHEN (
  NEW.topic_id IS NULL
  AND NEW.curriculum_topic_id IS NULL
)
OR (
  NEW.topic_id IS NOT NULL
  AND NEW.curriculum_topic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      curriculum_topics
    WHERE
      id = NEW.curriculum_topic_id
      AND topic_id = NEW.topic_id
  )
) BEGIN
SELECT
  RAISE (ABORT, 'lesson topic requires a compatible topic');

END;

CREATE TRIGGER lesson_topics_integrity_update BEFORE
UPDATE ON lesson_topics WHEN (
  NEW.topic_id IS NULL
  AND NEW.curriculum_topic_id IS NULL
)
OR (
  NEW.topic_id IS NOT NULL
  AND NEW.curriculum_topic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      curriculum_topics
    WHERE
      id = NEW.curriculum_topic_id
      AND topic_id = NEW.topic_id
  )
) BEGIN
SELECT
  RAISE (ABORT, 'lesson topic requires a compatible topic');

END;

CREATE TRIGGER resource_topics_integrity_insert BEFORE INSERT ON resource_topics WHEN (
  NEW.topic_id IS NULL
  AND NEW.curriculum_topic_id IS NULL
)
OR (
  NEW.topic_id IS NOT NULL
  AND NEW.curriculum_topic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      curriculum_topics
    WHERE
      id = NEW.curriculum_topic_id
      AND topic_id = NEW.topic_id
  )
) BEGIN
SELECT
  RAISE (ABORT, 'resource topic requires a compatible topic');

END;

CREATE TRIGGER resource_topics_integrity_update BEFORE
UPDATE ON resource_topics WHEN (
  NEW.topic_id IS NULL
  AND NEW.curriculum_topic_id IS NULL
)
OR (
  NEW.topic_id IS NOT NULL
  AND NEW.curriculum_topic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      curriculum_topics
    WHERE
      id = NEW.curriculum_topic_id
      AND topic_id = NEW.topic_id
  )
) BEGIN
SELECT
  RAISE (ABORT, 'resource topic requires a compatible topic');

END;

CREATE TRIGGER learning_course_targets_integrity_insert BEFORE INSERT ON learning_course_targets WHEN (
  NEW.admission_process_id IS NULL
  AND NEW.edition_id IS NULL
)
OR (
  NEW.admission_process_id IS NOT NULL
  AND NEW.edition_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      editions
    WHERE
      id = NEW.edition_id
      AND admission_process_id = NEW.admission_process_id
  )
) BEGIN
SELECT
  RAISE (ABORT, 'learning target requires a compatible process or edition');

END;

CREATE TRIGGER learning_course_targets_integrity_update BEFORE
UPDATE ON learning_course_targets WHEN (
  NEW.admission_process_id IS NULL
  AND NEW.edition_id IS NULL
)
OR (
  NEW.admission_process_id IS NOT NULL
  AND NEW.edition_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      editions
    WHERE
      id = NEW.edition_id
      AND admission_process_id = NEW.admission_process_id
  )
) BEGIN
SELECT
  RAISE (ABORT, 'learning target requires a compatible process or edition');

END;

CREATE TRIGGER course_stage_requirements_integrity_insert BEFORE INSERT ON course_stage_requirements WHEN NOT EXISTS (
  SELECT
    1
  FROM
    course_offerings co
    JOIN stages st ON st.edition_id = co.edition_id
  WHERE
    co.id = NEW.course_offering_id
    AND st.id = NEW.stage_id
)
OR (
  NEW.paper_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      papers
    WHERE
      id = NEW.paper_id
      AND stage_id = NEW.stage_id
  )
) BEGIN
SELECT
  RAISE (ABORT, 'course requirement belongs to another edition or stage');

END;

CREATE TRIGGER course_stage_requirements_integrity_update BEFORE
UPDATE ON course_stage_requirements WHEN NOT EXISTS (
  SELECT
    1
  FROM
    course_offerings co
    JOIN stages st ON st.edition_id = co.edition_id
  WHERE
    co.id = NEW.course_offering_id
    AND st.id = NEW.stage_id
)
OR (
  NEW.paper_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      papers
    WHERE
      id = NEW.paper_id
      AND stage_id = NEW.stage_id
  )
) BEGIN
SELECT
  RAISE (ABORT, 'course requirement belongs to another edition or stage');

END;

CREATE TRIGGER degree_programs_integrity_insert BEFORE INSERT ON degree_programs WHEN NEW.campus_id IS NOT NULL
AND NOT EXISTS (
  SELECT
    1
  FROM
    campuses
  WHERE
    id = NEW.campus_id
    AND university_id = NEW.university_id
) BEGIN
SELECT
  RAISE (ABORT, 'degree campus belongs to another university');

END;

CREATE TRIGGER degree_programs_integrity_update BEFORE
UPDATE ON degree_programs WHEN NEW.campus_id IS NOT NULL
AND NOT EXISTS (
  SELECT
    1
  FROM
    campuses
  WHERE
    id = NEW.campus_id
    AND university_id = NEW.university_id
) BEGIN
SELECT
  RAISE (ABORT, 'degree campus belongs to another university');

END;

CREATE TRIGGER assessment_sets_integrity_insert BEFORE INSERT ON assessment_sets WHEN NEW.edition_id IS NOT NULL
AND NEW.admission_process_id IS NOT NULL
AND NOT EXISTS (
  SELECT
    1
  FROM
    editions
  WHERE
    id = NEW.edition_id
    AND admission_process_id = NEW.admission_process_id
) BEGIN
SELECT
  RAISE (ABORT, 'assessment belongs to another admission process');

END;

CREATE TRIGGER assessment_sets_integrity_update BEFORE
UPDATE ON assessment_sets WHEN NEW.edition_id IS NOT NULL
AND NEW.admission_process_id IS NOT NULL
AND NOT EXISTS (
  SELECT
    1
  FROM
    editions
  WHERE
    id = NEW.edition_id
    AND admission_process_id = NEW.admission_process_id
) BEGIN
SELECT
  RAISE (ABORT, 'assessment belongs to another admission process');

END;

CREATE TRIGGER learning_maps_integrity_insert BEFORE INSERT ON learning_maps WHEN NEW.edition_id IS NOT NULL
AND NEW.admission_process_id IS NOT NULL
AND NOT EXISTS (
  SELECT
    1
  FROM
    editions
  WHERE
    id = NEW.edition_id
    AND admission_process_id = NEW.admission_process_id
) BEGIN
SELECT
  RAISE (ABORT, 'map belongs to another admission process');

END;

CREATE TRIGGER learning_maps_integrity_update BEFORE
UPDATE ON learning_maps WHEN NEW.edition_id IS NOT NULL
AND NEW.admission_process_id IS NOT NULL
AND NOT EXISTS (
  SELECT
    1
  FROM
    editions
  WHERE
    id = NEW.edition_id
    AND admission_process_id = NEW.admission_process_id
) BEGIN
SELECT
  RAISE (ABORT, 'map belongs to another admission process');

END;

CREATE TRIGGER learning_map_edges_integrity_insert BEFORE INSERT ON learning_map_edges WHEN NEW.from_topic_id = NEW.to_topic_id
OR NOT EXISTS (
  SELECT
    1
  FROM
    learning_map_topics
  WHERE
    map_id = NEW.map_id
    AND curriculum_topic_id = NEW.from_topic_id
)
OR NOT EXISTS (
  SELECT
    1
  FROM
    learning_map_topics
  WHERE
    map_id = NEW.map_id
    AND curriculum_topic_id = NEW.to_topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'map edge requires two distinct member topics');

END;

CREATE TRIGGER learning_map_edges_integrity_update BEFORE
UPDATE ON learning_map_edges WHEN NEW.from_topic_id = NEW.to_topic_id
OR NOT EXISTS (
  SELECT
    1
  FROM
    learning_map_topics
  WHERE
    map_id = NEW.map_id
    AND curriculum_topic_id = NEW.from_topic_id
)
OR NOT EXISTS (
  SELECT
    1
  FROM
    learning_map_topics
  WHERE
    map_id = NEW.map_id
    AND curriculum_topic_id = NEW.to_topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'map edge requires two distinct member topics');

END;

CREATE TRIGGER lesson_sources_integrity_insert BEFORE INSERT ON lesson_sources WHEN NOT EXISTS (
  SELECT
    1
  FROM
    source_documents
  WHERE
    id = NEW.source_document_id
) BEGIN
SELECT
  RAISE (ABORT, 'lesson source document does not exist');

END;

CREATE TRIGGER lesson_sources_integrity_update BEFORE
UPDATE ON lesson_sources WHEN NOT EXISTS (
  SELECT
    1
  FROM
    source_documents
  WHERE
    id = NEW.source_document_id
) BEGIN
SELECT
  RAISE (ABORT, 'lesson source document does not exist');

END;

CREATE TRIGGER question_occurrences_dependent_owners_update BEFORE
UPDATE ON question_occurrences WHEN EXISTS (
  SELECT
    1
  FROM
    question_occurrence_options o
    JOIN question_options opt ON opt.id = o.question_option_id
  WHERE
    o.occurrence_id = OLD.id
    AND opt.question_id <> NEW.question_id
)
OR EXISTS (
  SELECT
    1
  FROM
    canonical_answer_keys
  WHERE
    occurrence_id = OLD.id
    AND question_id <> NEW.question_id
)
OR EXISTS (
  SELECT
    1
  FROM
    answer_keys ak
    JOIN question_parts qp ON qp.id = ak.question_part_id
  WHERE
    ak.question_occurrence_id = OLD.id
    AND qp.question_id <> NEW.question_id
)
OR EXISTS (
  SELECT
    1
  FROM
    answer_keys ak
    JOIN answer_key_options ako ON ako.answer_key_id = ak.id
    JOIN question_options opt ON opt.id = ako.question_option_id
  WHERE
    ak.question_occurrence_id = OLD.id
    AND opt.question_id <> NEW.question_id
)
OR EXISTS (
  SELECT
    1
  FROM
    question_topics qt
    JOIN curriculum_topics ct ON ct.id = qt.curriculum_topic_id
    JOIN curricula c ON c.id = ct.curriculum_id
    JOIN papers p ON p.id = NEW.paper_id
    JOIN stages st ON st.id = p.stage_id
  WHERE
    qt.question_occurrence_id = OLD.id
    AND c.edition_id <> st.edition_id
) BEGIN
SELECT
  RAISE (ABORT, 'occurrence update would invalidate dependent owners');

END;

CREATE TRIGGER paper_versions_dependent_owners_update BEFORE
UPDATE ON paper_versions WHEN EXISTS (
  SELECT
    1
  FROM
    question_occurrences
  WHERE
    paper_version_id = OLD.id
    AND paper_id <> NEW.paper_id
) BEGIN
SELECT
  RAISE (ABORT, 'paper version update would invalidate occurrence owners');

END;

CREATE TRIGGER question_options_dependent_owners_update BEFORE
UPDATE ON question_options WHEN EXISTS (
  SELECT
    1
  FROM
    question_occurrence_options o
    JOIN question_occurrences qo ON qo.id = o.occurrence_id
  WHERE
    o.question_option_id = OLD.id
    AND qo.question_id <> NEW.question_id
)
OR EXISTS (
  SELECT
    1
  FROM
    canonical_answer_key_options ako
    JOIN canonical_answer_keys ak ON ak.id = ako.answer_key_id
  WHERE
    ako.question_option_id = OLD.id
    AND ak.question_id <> NEW.question_id
)
OR EXISTS (
  SELECT
    1
  FROM
    answer_key_options ako
    JOIN answer_keys ak ON ak.id = ako.answer_key_id
    JOIN question_occurrences qo ON qo.id = ak.question_occurrence_id
  WHERE
    ako.question_option_id = OLD.id
    AND qo.question_id <> NEW.question_id
) BEGIN
SELECT
  RAISE (ABORT, 'option update would invalidate dependent owners');

END;

CREATE TRIGGER question_parts_dependent_owners_update BEFORE
UPDATE ON question_parts WHEN EXISTS (
  SELECT
    1
  FROM
    canonical_answer_keys
  WHERE
    question_part_id = OLD.id
    AND question_id <> NEW.question_id
)
OR EXISTS (
  SELECT
    1
  FROM
    answer_keys ak
    JOIN question_occurrences qo ON qo.id = ak.question_occurrence_id
  WHERE
    ak.question_part_id = OLD.id
    AND qo.question_id <> NEW.question_id
) BEGIN
SELECT
  RAISE (ABORT, 'part update would invalidate dependent owners');

END;

CREATE TRIGGER campuses_dependent_owners_update BEFORE
UPDATE ON campuses WHEN EXISTS (
  SELECT
    1
  FROM
    degree_programs
  WHERE
    campus_id = OLD.id
    AND university_id <> NEW.university_id
) BEGIN
SELECT
  RAISE (ABORT, 'campus update would invalidate degree owners');

END;

CREATE TRIGGER course_offerings_dependent_owners_update BEFORE
UPDATE ON course_offerings WHEN EXISTS (
  SELECT
    1
  FROM
    course_stage_requirements csr
    JOIN stages st ON st.id = csr.stage_id
  WHERE
    csr.course_offering_id = OLD.id
    AND st.edition_id <> NEW.edition_id
) BEGIN
SELECT
  RAISE (ABORT, 'offering update would invalidate stage requirements');

END;

CREATE TRIGGER stages_dependent_owners_update BEFORE
UPDATE ON stages WHEN EXISTS (
  SELECT
    1
  FROM
    course_stage_requirements csr
    JOIN course_offerings co ON co.id = csr.course_offering_id
  WHERE
    csr.stage_id = OLD.id
    AND co.edition_id <> NEW.edition_id
)
OR EXISTS (
  SELECT
    1
  FROM
    papers p
    JOIN question_occurrences qo ON qo.paper_id = p.id
    JOIN question_topics qt ON qt.question_occurrence_id = qo.id
    JOIN curriculum_topics ct ON ct.id = qt.curriculum_topic_id
    JOIN curricula c ON c.id = ct.curriculum_id
  WHERE
    p.stage_id = OLD.id
    AND c.edition_id <> NEW.edition_id
) BEGIN
SELECT
  RAISE (ABORT, 'stage update would invalidate edition references');

END;

CREATE TRIGGER papers_dependent_owners_update BEFORE
UPDATE ON papers WHEN EXISTS (
  SELECT
    1
  FROM
    course_stage_requirements
  WHERE
    paper_id = OLD.id
    AND stage_id <> NEW.stage_id
)
OR EXISTS (
  SELECT
    1
  FROM
    question_occurrences qo
    JOIN question_topics qt ON qt.question_occurrence_id = qo.id
    JOIN curriculum_topics ct ON ct.id = qt.curriculum_topic_id
    JOIN curricula c ON c.id = ct.curriculum_id
    JOIN stages st ON st.id = NEW.stage_id
  WHERE
    qo.paper_id = OLD.id
    AND c.edition_id <> st.edition_id
) BEGIN
SELECT
  RAISE (ABORT, 'paper update would invalidate stage or curriculum references');

END;

CREATE TRIGGER editions_dependent_owners_update BEFORE
UPDATE ON editions WHEN EXISTS (
  SELECT
    1
  FROM
    learning_course_targets
  WHERE
    edition_id = OLD.id
    AND admission_process_id IS NOT NULL
    AND admission_process_id <> NEW.admission_process_id
)
OR EXISTS (
  SELECT
    1
  FROM
    assessment_sets
  WHERE
    edition_id = OLD.id
    AND admission_process_id IS NOT NULL
    AND admission_process_id <> NEW.admission_process_id
)
OR EXISTS (
  SELECT
    1
  FROM
    learning_maps
  WHERE
    edition_id = OLD.id
    AND admission_process_id IS NOT NULL
    AND admission_process_id <> NEW.admission_process_id
) BEGIN
SELECT
  RAISE (ABORT, 'edition update would invalidate admission process references');

END;

CREATE TRIGGER curricula_dependent_owners_update BEFORE
UPDATE ON curricula WHEN EXISTS (
  SELECT
    1
  FROM
    curriculum_topics ct
    JOIN question_topics qt ON qt.curriculum_topic_id = ct.id
    JOIN question_occurrences qo ON qo.id = qt.question_occurrence_id
    JOIN papers p ON p.id = qo.paper_id
    JOIN stages st ON st.id = p.stage_id
  WHERE
    ct.curriculum_id = OLD.id
    AND st.edition_id <> NEW.edition_id
) BEGIN
SELECT
  RAISE (ABORT, 'curriculum update would invalidate occurrence classification');

END;

CREATE TRIGGER question_topics_integrity_insert BEFORE INSERT ON question_topics WHEN NOT EXISTS (
  SELECT
    1
  FROM
    question_occurrences qo
    JOIN papers p ON p.id = qo.paper_id
    JOIN stages st ON st.id = p.stage_id
    JOIN curricula c ON c.edition_id = st.edition_id
    JOIN curriculum_topics ct ON ct.curriculum_id = c.id
  WHERE
    qo.id = NEW.question_occurrence_id
    AND ct.id = NEW.curriculum_topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'question classification belongs to another edition');

END;

CREATE TRIGGER question_topics_integrity_update BEFORE
UPDATE ON question_topics WHEN NOT EXISTS (
  SELECT
    1
  FROM
    question_occurrences qo
    JOIN papers p ON p.id = qo.paper_id
    JOIN stages st ON st.id = p.stage_id
    JOIN curricula c ON c.edition_id = st.edition_id
    JOIN curriculum_topics ct ON ct.curriculum_id = c.id
  WHERE
    qo.id = NEW.question_occurrence_id
    AND ct.id = NEW.curriculum_topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'question classification belongs to another edition');

END;

CREATE TRIGGER study_plan_steps_integrity_insert BEFORE INSERT ON study_plan_steps WHEN (
  NEW.item_id IS NOT NULL
  AND NEW.module_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      learning_course_items
    WHERE
      id = NEW.item_id
      AND module_id = NEW.module_id
  )
)
OR EXISTS (
  SELECT
    1
  FROM
    study_plans sp
    JOIN learning_course_modules m ON m.id = NEW.module_id
  WHERE
    sp.id = NEW.study_plan_id
    AND sp.learning_course_id IS NOT NULL
    AND sp.learning_course_id <> m.learning_course_id
)
OR EXISTS (
  SELECT
    1
  FROM
    study_plans sp
    JOIN learning_course_items i ON i.id = NEW.item_id
    JOIN learning_course_modules m ON m.id = i.module_id
  WHERE
    sp.id = NEW.study_plan_id
    AND sp.learning_course_id IS NOT NULL
    AND sp.learning_course_id <> m.learning_course_id
) BEGIN
SELECT
  RAISE (ABORT, 'plan step has incompatible course or module');

END;

CREATE TRIGGER study_plan_steps_integrity_update BEFORE
UPDATE ON study_plan_steps WHEN (
  NEW.item_id IS NOT NULL
  AND NEW.module_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      learning_course_items
    WHERE
      id = NEW.item_id
      AND module_id = NEW.module_id
  )
)
OR EXISTS (
  SELECT
    1
  FROM
    study_plans sp
    JOIN learning_course_modules m ON m.id = NEW.module_id
  WHERE
    sp.id = NEW.study_plan_id
    AND sp.learning_course_id IS NOT NULL
    AND sp.learning_course_id <> m.learning_course_id
)
OR EXISTS (
  SELECT
    1
  FROM
    study_plans sp
    JOIN learning_course_items i ON i.id = NEW.item_id
    JOIN learning_course_modules m ON m.id = i.module_id
  WHERE
    sp.id = NEW.study_plan_id
    AND sp.learning_course_id IS NOT NULL
    AND sp.learning_course_id <> m.learning_course_id
) BEGIN
SELECT
  RAISE (ABORT, 'plan step has incompatible course or module');

END;

CREATE TRIGGER learning_map_topics_edges_delete BEFORE DELETE ON learning_map_topics WHEN EXISTS (
  SELECT
    1
  FROM
    learning_map_edges
  WHERE
    map_id = OLD.map_id
    AND (
      from_topic_id = OLD.curriculum_topic_id
      OR to_topic_id = OLD.curriculum_topic_id
    )
) BEGIN
SELECT
  RAISE (ABORT, 'remove map edges before their member topics');

END;

CREATE TRIGGER learning_map_topics_edges_update BEFORE
UPDATE ON learning_map_topics WHEN (
  NEW.map_id <> OLD.map_id
  OR NEW.curriculum_topic_id <> OLD.curriculum_topic_id
)
AND EXISTS (
  SELECT
    1
  FROM
    learning_map_edges
  WHERE
    map_id = OLD.map_id
    AND (
      from_topic_id = OLD.curriculum_topic_id
      OR to_topic_id = OLD.curriculum_topic_id
    )
) BEGIN
SELECT
  RAISE (ABORT, 'remove map edges before changing their member topics');

END;

CREATE TRIGGER source_documents_lesson_sources_delete BEFORE DELETE ON source_documents WHEN EXISTS (
  SELECT
    1
  FROM
    lesson_sources
  WHERE
    source_document_id = OLD.id
) BEGIN
SELECT
  RAISE (ABORT, 'source document is referenced by a lesson');

END;

CREATE TRIGGER source_documents_lesson_sources_update BEFORE
UPDATE OF id ON source_documents WHEN NEW.id <> OLD.id
AND EXISTS (
  SELECT
    1
  FROM
    lesson_sources
  WHERE
    source_document_id = OLD.id
) BEGIN
SELECT
  RAISE (ABORT, 'source document is referenced by a lesson');

END;

INSERT INTO
  content_releases (version, schema_version, generated_at, notes)
VALUES
  (
    'editorial-integrity-schema',
    5,
    CURRENT_TIMESTAMP,
    'Contrato editorial aditivo com integridade de referências.'
  );

-- migrate:down
DELETE FROM content_releases
WHERE
  version = 'editorial-integrity-schema';

DROP TRIGGER IF EXISTS source_documents_lesson_sources_update;

DROP TRIGGER IF EXISTS source_documents_lesson_sources_delete;

DROP TRIGGER IF EXISTS learning_map_topics_edges_update;

DROP TRIGGER IF EXISTS learning_map_topics_edges_delete;

DROP TRIGGER IF EXISTS study_plan_steps_integrity_update;

DROP TRIGGER IF EXISTS study_plan_steps_integrity_insert;

DROP TRIGGER IF EXISTS question_topics_integrity_update;

DROP TRIGGER IF EXISTS question_topics_integrity_insert;

DROP TRIGGER IF EXISTS curricula_dependent_owners_update;

DROP TRIGGER IF EXISTS editions_dependent_owners_update;

DROP TRIGGER IF EXISTS papers_dependent_owners_update;

DROP TRIGGER IF EXISTS stages_dependent_owners_update;

DROP TRIGGER IF EXISTS course_offerings_dependent_owners_update;

DROP TRIGGER IF EXISTS campuses_dependent_owners_update;

DROP TRIGGER IF EXISTS question_parts_dependent_owners_update;

DROP TRIGGER IF EXISTS question_options_dependent_owners_update;

DROP TRIGGER IF EXISTS paper_versions_dependent_owners_update;

DROP TRIGGER IF EXISTS question_occurrences_dependent_owners_update;

DROP TRIGGER IF EXISTS lesson_sources_integrity_update;

DROP TRIGGER IF EXISTS lesson_sources_integrity_insert;

DROP TRIGGER IF EXISTS learning_map_edges_integrity_update;

DROP TRIGGER IF EXISTS learning_map_edges_integrity_insert;

DROP TRIGGER IF EXISTS learning_maps_integrity_update;

DROP TRIGGER IF EXISTS learning_maps_integrity_insert;

DROP TRIGGER IF EXISTS assessment_sets_integrity_update;

DROP TRIGGER IF EXISTS assessment_sets_integrity_insert;

DROP TRIGGER IF EXISTS degree_programs_integrity_update;

DROP TRIGGER IF EXISTS degree_programs_integrity_insert;

DROP TRIGGER IF EXISTS course_stage_requirements_integrity_update;

DROP TRIGGER IF EXISTS course_stage_requirements_integrity_insert;

DROP TRIGGER IF EXISTS learning_course_targets_integrity_update;

DROP TRIGGER IF EXISTS learning_course_targets_integrity_insert;

DROP TRIGGER IF EXISTS resource_topics_integrity_update;

DROP TRIGGER IF EXISTS resource_topics_integrity_insert;

DROP TRIGGER IF EXISTS lesson_topics_integrity_update;

DROP TRIGGER IF EXISTS lesson_topics_integrity_insert;

DROP TRIGGER IF EXISTS curriculum_topics_integrity_update;

DROP TRIGGER IF EXISTS curriculum_topics_integrity_insert;

DROP TRIGGER IF EXISTS answer_key_options_integrity_update;

DROP TRIGGER IF EXISTS answer_key_options_integrity_insert;

DROP TRIGGER IF EXISTS answer_keys_integrity_update;

DROP TRIGGER IF EXISTS answer_keys_integrity_insert;

DROP TRIGGER IF EXISTS canonical_answer_key_options_integrity_update;

DROP TRIGGER IF EXISTS canonical_answer_key_options_integrity_insert;

DROP TRIGGER IF EXISTS canonical_answer_keys_integrity_update;

DROP TRIGGER IF EXISTS canonical_answer_keys_integrity_insert;

DROP TRIGGER IF EXISTS question_occurrence_options_integrity_update;

DROP TRIGGER IF EXISTS question_occurrence_options_integrity_insert;

DROP TRIGGER IF EXISTS question_occurrences_integrity_update;

DROP TRIGGER IF EXISTS question_occurrences_integrity_insert;

DROP TRIGGER IF EXISTS learning_course_items_integrity_update;

DROP TRIGGER IF EXISTS learning_course_items_integrity_insert;

DROP TRIGGER IF EXISTS assessment_set_items_integrity_update;

DROP TRIGGER IF EXISTS assessment_set_items_integrity_insert;

DROP INDEX IF EXISTS question_occurrences_unversioned_number;

DROP INDEX IF EXISTS course_offerings_unclassified;

DROP INDEX IF EXISTS course_stage_requirements_whole_stage;

DROP INDEX IF EXISTS lesson_topics_canonical;

DROP INDEX IF EXISTS lesson_topics_curriculum;

DROP INDEX IF EXISTS resource_topics_canonical;

DROP INDEX IF EXISTS resource_topics_curriculum;

DROP INDEX IF EXISTS learning_course_targets_process;

DROP INDEX IF EXISTS learning_course_targets_edition;

ALTER TABLE assessment_set_items
DROP COLUMN question_id;

ALTER TABLE assessment_sets
DROP COLUMN expected_question_count;

ALTER TABLE learning_course_items
DROP COLUMN question_id;

DROP TABLE IF EXISTS canonical_answer_key_options;

DROP TABLE IF EXISTS canonical_answer_keys;

DROP TABLE IF EXISTS question_occurrence_options;

DROP TABLE IF EXISTS question_assets;

DROP TABLE IF EXISTS stimulus_assets;

DROP TABLE IF EXISTS question_stimuli;

DROP TABLE IF EXISTS content_assets;

DROP TABLE IF EXISTS stimuli;

DROP TABLE IF EXISTS canonical_question_topics;
