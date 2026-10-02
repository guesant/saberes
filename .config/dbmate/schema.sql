-- migrate:up
PRAGMA foreign_keys = ON;

CREATE TABLE universities (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  acronym TEXT,
  website TEXT,
  country TEXT DEFAULT 'BR',
  state TEXT,
  city TEXT,
  is_published INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE organizers (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'exam_board',
  website TEXT,
  is_published INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE admission_processes (
  id INTEGER PRIMARY KEY,
  university_id INTEGER,
  organizer_id INTEGER,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  description TEXT,
  website TEXT,
  is_published INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (university_id) REFERENCES universities (id),
  FOREIGN KEY (organizer_id) REFERENCES organizers (id)
);

CREATE TABLE editions (
  id INTEGER PRIMARY KEY,
  admission_process_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  is_published INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (admission_process_id) REFERENCES admission_processes (id),
  UNIQUE (admission_process_id, year)
);

CREATE TABLE source_documents (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  provider TEXT,
  kind TEXT NOT NULL DEFAULT 'web',
  published_at TEXT,
  checksum TEXT,
  is_official INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE stages (
  id INTEGER PRIMARY KEY,
  edition_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  sequence INTEGER NOT NULL DEFAULT 1,
  kind TEXT NOT NULL,
  day_number INTEGER,
  description TEXT,
  is_published INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (edition_id) REFERENCES editions (id),
  UNIQUE (edition_id, slug)
);

CREATE TABLE papers (
  id INTEGER PRIMARY KEY,
  stage_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  paper_type TEXT NOT NULL DEFAULT 'objective',
  duration_minutes INTEGER,
  source_document_id INTEGER,
  is_published INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (stage_id) REFERENCES stages (id),
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  UNIQUE (stage_id, slug)
);

CREATE TABLE languages (id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, name TEXT NOT NULL);

CREATE TABLE paper_versions (
  id INTEGER PRIMARY KEY,
  paper_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  language_id INTEGER,
  source_document_id INTEGER,
  FOREIGN KEY (paper_id) REFERENCES papers (id),
  FOREIGN KEY (language_id) REFERENCES languages (id),
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  UNIQUE (paper_id, code)
);

CREATE TABLE assessment_areas (id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL);

CREATE TABLE subjects (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  assessment_area_id INTEGER,
  FOREIGN KEY (assessment_area_id) REFERENCES assessment_areas (id)
);

CREATE TABLE paper_subjects (
  paper_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  assessment_area_id INTEGER,
  position INTEGER NOT NULL DEFAULT 0,
  question_count INTEGER,
  PRIMARY KEY (paper_id, subject_id),
  FOREIGN KEY (paper_id) REFERENCES papers (id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects (id),
  FOREIGN KEY (assessment_area_id) REFERENCES assessment_areas (id)
);

CREATE TABLE campuses (
  id INTEGER PRIMARY KEY,
  university_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  FOREIGN KEY (university_id) REFERENCES universities (id)
);

CREATE TABLE degree_programs (
  id INTEGER PRIMARY KEY,
  university_id INTEGER NOT NULL,
  campus_id INTEGER,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (university_id) REFERENCES universities (id),
  FOREIGN KEY (campus_id) REFERENCES campuses (id)
);

CREATE TABLE admission_modalities (id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL);

CREATE TABLE course_offerings (
  id INTEGER PRIMARY KEY,
  edition_id INTEGER NOT NULL,
  degree_program_id INTEGER NOT NULL,
  modality_id INTEGER,
  seats INTEGER,
  FOREIGN KEY (edition_id) REFERENCES editions (id),
  FOREIGN KEY (degree_program_id) REFERENCES degree_programs (id),
  FOREIGN KEY (modality_id) REFERENCES admission_modalities (id),
  UNIQUE (edition_id, degree_program_id, modality_id)
);

CREATE TABLE course_stage_requirements (
  course_offering_id INTEGER NOT NULL,
  stage_id INTEGER NOT NULL,
  paper_id INTEGER,
  required INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (course_offering_id, stage_id, paper_id),
  FOREIGN KEY (course_offering_id) REFERENCES course_offerings (id) ON DELETE CASCADE,
  FOREIGN KEY (stage_id) REFERENCES stages (id),
  FOREIGN KEY (paper_id) REFERENCES papers (id)
);

CREATE TABLE questions (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  statement TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  image_path TEXT,
  status TEXT NOT NULL DEFAULT 'published'
);

CREATE TABLE question_occurrences (
  id INTEGER PRIMARY KEY,
  question_id INTEGER NOT NULL,
  paper_id INTEGER NOT NULL,
  paper_version_id INTEGER,
  subject_id INTEGER,
  assessment_area_id INTEGER,
  occurrence_key TEXT UNIQUE NOT NULL,
  number INTEGER NOT NULL,
  original_number INTEGER,
  source_document_id INTEGER,
  source_page INTEGER,
  status TEXT NOT NULL DEFAULT 'published',
  notes TEXT,
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (paper_id) REFERENCES papers (id),
  FOREIGN KEY (paper_version_id) REFERENCES paper_versions (id),
  FOREIGN KEY (subject_id) REFERENCES subjects (id),
  FOREIGN KEY (assessment_area_id) REFERENCES assessment_areas (id),
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  UNIQUE (paper_id, paper_version_id, number)
);

CREATE TABLE question_options (
  id INTEGER PRIMARY KEY,
  question_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  text TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  UNIQUE (question_id, code)
);

CREATE TABLE question_parts (
  id INTEGER PRIMARY KEY,
  question_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  label TEXT,
  prompt TEXT,
  type TEXT NOT NULL DEFAULT 'discursive',
  position INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  UNIQUE (question_id, code)
);

CREATE TABLE answer_keys (
  id INTEGER PRIMARY KEY,
  question_occurrence_id INTEGER NOT NULL,
  question_part_id INTEGER,
  answer_type TEXT NOT NULL,
  answer_value TEXT,
  explanation TEXT,
  is_automatically_gradable INTEGER NOT NULL DEFAULT 0,
  max_points REAL,
  FOREIGN KEY (question_occurrence_id) REFERENCES question_occurrences (id) ON DELETE CASCADE,
  FOREIGN KEY (question_part_id) REFERENCES question_parts (id)
);

CREATE TABLE answer_key_options (
  answer_key_id INTEGER NOT NULL,
  question_option_id INTEGER NOT NULL,
  PRIMARY KEY (answer_key_id, question_option_id),
  FOREIGN KEY (answer_key_id) REFERENCES answer_keys (id) ON DELETE CASCADE,
  FOREIGN KEY (question_option_id) REFERENCES question_options (id) ON DELETE CASCADE
);

CREATE TABLE grading_rubrics (
  id INTEGER PRIMARY KEY,
  question_occurrence_id INTEGER,
  essay_prompt_id INTEGER,
  name TEXT NOT NULL,
  criteria_json TEXT NOT NULL,
  max_points REAL,
  FOREIGN KEY (question_occurrence_id) REFERENCES question_occurrences (id) ON DELETE CASCADE
);

CREATE TABLE question_sources (
  question_occurrence_id INTEGER NOT NULL,
  source_document_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'exam',
  PRIMARY KEY (question_occurrence_id, source_document_id, role),
  FOREIGN KEY (question_occurrence_id) REFERENCES question_occurrences (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id)
);

CREATE TABLE curricula (
  id INTEGER PRIMARY KEY,
  edition_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  source_document_id INTEGER,
  FOREIGN KEY (edition_id) REFERENCES editions (id),
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  UNIQUE (edition_id, name)
);

CREATE TABLE topics (
  id INTEGER PRIMARY KEY,
  parent_id INTEGER,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (parent_id) REFERENCES topics (id)
);

CREATE TABLE topic_subjects (
  topic_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (topic_id, subject_id),
  FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects (id)
);

CREATE TABLE curriculum_topics (
  id INTEGER PRIMARY KEY,
  curriculum_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  parent_id INTEGER,
  label TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (curriculum_id) REFERENCES curricula (id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics (id),
  FOREIGN KEY (parent_id) REFERENCES curriculum_topics (id),
  UNIQUE (curriculum_id, topic_id)
);

CREATE TABLE topic_relations (
  topic_id INTEGER NOT NULL,
  related_topic_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL,
  note TEXT,
  PRIMARY KEY (topic_id, related_topic_id, relation_type),
  FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE,
  FOREIGN KEY (related_topic_id) REFERENCES topics (id) ON DELETE CASCADE,
  CHECK (topic_id <> related_topic_id)
);

CREATE TABLE question_topics (
  question_occurrence_id INTEGER NOT NULL,
  curriculum_topic_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'primary',
  confidence REAL,
  PRIMARY KEY (question_occurrence_id, curriculum_topic_id),
  FOREIGN KEY (question_occurrence_id) REFERENCES question_occurrences (id) ON DELETE CASCADE,
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id) ON DELETE CASCADE
);

CREATE TABLE lessons (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  content_key TEXT UNIQUE,
  title TEXT NOT NULL,
  intro TEXT,
  objective TEXT,
  audience TEXT NOT NULL DEFAULT 'estudantes',
  level TEXT NOT NULL DEFAULT 'all',
  estimated_minutes INTEGER NOT NULL DEFAULT 3,
  editorial_version TEXT NOT NULL DEFAULT '1.0.0',
  review_status TEXT NOT NULL DEFAULT 'review',
  is_published INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE lesson_sections (
  id INTEGER PRIMARY KEY,
  lesson_id INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'theory',
  pedagogical_role TEXT NOT NULL DEFAULT 'formalization',
  title TEXT,
  content TEXT NOT NULL,
  content_format TEXT NOT NULL DEFAULT 'markdown',
  blocks_json TEXT NOT NULL DEFAULT '[]',
  read_time_minutes INTEGER,
  position INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
);

CREATE TABLE lesson_sources (
  lesson_id INTEGER NOT NULL,
  source_document_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'reference',
  PRIMARY KEY (lesson_id, source_document_id, role),
  FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
);

CREATE TABLE lesson_topics (
  lesson_id INTEGER NOT NULL,
  topic_id INTEGER,
  curriculum_topic_id INTEGER,
  PRIMARY KEY (lesson_id, topic_id, curriculum_topic_id),
  FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics (id),
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id)
);

CREATE TABLE resources (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'article',
  description TEXT,
  is_free INTEGER NOT NULL DEFAULT 1,
  is_published INTEGER NOT NULL DEFAULT 1,
  source_document_id INTEGER,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id)
);

CREATE TABLE resource_topics (
  resource_id INTEGER NOT NULL,
  topic_id INTEGER,
  curriculum_topic_id INTEGER,
  PRIMARY KEY (resource_id, topic_id, curriculum_topic_id),
  FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics (id),
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id)
);

CREATE TABLE assessment_sets (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  kind TEXT NOT NULL DEFAULT 'question_set',
  edition_id INTEGER,
  admission_process_id INTEGER,
  subject_id INTEGER,
  duration_minutes INTEGER,
  is_published INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (edition_id) REFERENCES editions (id),
  FOREIGN KEY (admission_process_id) REFERENCES admission_processes (id),
  FOREIGN KEY (subject_id) REFERENCES subjects (id)
);

CREATE TABLE assessment_set_items (
  assessment_set_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'question',
  question_occurrence_id INTEGER,
  lesson_id INTEGER,
  points REAL DEFAULT 1,
  PRIMARY KEY (assessment_set_id, position),
  FOREIGN KEY (assessment_set_id) REFERENCES assessment_sets (id) ON DELETE CASCADE,
  FOREIGN KEY (question_occurrence_id) REFERENCES question_occurrences (id),
  FOREIGN KEY (lesson_id) REFERENCES lessons (id)
);

CREATE TABLE learning_courses (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL DEFAULT 'all',
  course_type TEXT NOT NULL DEFAULT 'general',
  domain TEXT NOT NULL DEFAULT 'exam_prep',
  estimated_minutes INTEGER,
  is_published INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE learning_course_modules (
  id INTEGER PRIMARY KEY,
  learning_course_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (learning_course_id) REFERENCES learning_courses (id) ON DELETE CASCADE,
  UNIQUE (learning_course_id, slug)
);

CREATE TABLE learning_course_items (
  id INTEGER PRIMARY KEY,
  module_id INTEGER NOT NULL,
  item_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  lesson_id INTEGER,
  question_occurrence_id INTEGER,
  assessment_set_id INTEGER,
  duration_minutes INTEGER,
  is_required INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (module_id) REFERENCES learning_course_modules (id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons (id),
  FOREIGN KEY (question_occurrence_id) REFERENCES question_occurrences (id),
  FOREIGN KEY (assessment_set_id) REFERENCES assessment_sets (id)
);

CREATE TABLE learning_course_topics (
  learning_course_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (learning_course_id, topic_id),
  FOREIGN KEY (learning_course_id) REFERENCES learning_courses (id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
);

CREATE TABLE learning_course_targets (
  learning_course_id INTEGER NOT NULL,
  admission_process_id INTEGER,
  edition_id INTEGER,
  PRIMARY KEY (learning_course_id, admission_process_id, edition_id),
  FOREIGN KEY (learning_course_id) REFERENCES learning_courses (id) ON DELETE CASCADE,
  FOREIGN KEY (admission_process_id) REFERENCES admission_processes (id),
  FOREIGN KEY (edition_id) REFERENCES editions (id)
);

CREATE TABLE learning_maps (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  edition_id INTEGER,
  admission_process_id INTEGER,
  learning_course_id INTEGER,
  is_published INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (edition_id) REFERENCES editions (id),
  FOREIGN KEY (admission_process_id) REFERENCES admission_processes (id),
  FOREIGN KEY (learning_course_id) REFERENCES learning_courses (id)
);

CREATE TABLE learning_map_topics (
  map_id INTEGER NOT NULL,
  curriculum_topic_id INTEGER NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_milestone INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (map_id, curriculum_topic_id),
  FOREIGN KEY (map_id) REFERENCES learning_maps (id) ON DELETE CASCADE,
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id) ON DELETE CASCADE
);

CREATE TABLE learning_map_edges (
  map_id INTEGER NOT NULL,
  from_topic_id INTEGER NOT NULL,
  to_topic_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'prerequisite',
  PRIMARY KEY (map_id, from_topic_id, to_topic_id, relation_type),
  FOREIGN KEY (map_id) REFERENCES learning_maps (id) ON DELETE CASCADE,
  FOREIGN KEY (from_topic_id) REFERENCES curriculum_topics (id) ON DELETE CASCADE,
  FOREIGN KEY (to_topic_id) REFERENCES curriculum_topics (id) ON DELETE CASCADE
);

CREATE TABLE study_plans (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  objective TEXT,
  description TEXT,
  duration_days INTEGER,
  learning_course_id INTEGER,
  map_id INTEGER,
  edition_id INTEGER,
  is_published INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (learning_course_id) REFERENCES learning_courses (id),
  FOREIGN KEY (map_id) REFERENCES learning_maps (id),
  FOREIGN KEY (edition_id) REFERENCES editions (id)
);

CREATE TABLE study_plan_steps (
  id INTEGER PRIMARY KEY,
  study_plan_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  curriculum_topic_id INTEGER,
  module_id INTEGER,
  item_id INTEGER,
  estimated_minutes INTEGER,
  is_required INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (study_plan_id) REFERENCES study_plans (id) ON DELETE CASCADE,
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id),
  FOREIGN KEY (module_id) REFERENCES learning_course_modules (id),
  FOREIGN KEY (item_id) REFERENCES learning_course_items (id),
  UNIQUE (study_plan_id, position)
);

CREATE TABLE question_relations (
  question_occurrence_id INTEGER NOT NULL,
  related_occurrence_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'same_topic',
  PRIMARY KEY (question_occurrence_id, related_occurrence_id, relation_type),
  FOREIGN KEY (question_occurrence_id) REFERENCES question_occurrences (id) ON DELETE CASCADE,
  FOREIGN KEY (related_occurrence_id) REFERENCES question_occurrences (id) ON DELETE CASCADE
);

CREATE TABLE essay_prompts (
  id INTEGER PRIMARY KEY,
  stage_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  source_document_id INTEGER,
  FOREIGN KEY (stage_id) REFERENCES stages (id),
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id)
);

CREATE TABLE essay_evaluations (
  id INTEGER PRIMARY KEY,
  essay_prompt_id INTEGER NOT NULL,
  criteria_json TEXT NOT NULL,
  max_score REAL,
  notes TEXT,
  FOREIGN KEY (essay_prompt_id) REFERENCES essay_prompts (id) ON DELETE CASCADE
);

CREATE TABLE scoring_rules (
  id INTEGER PRIMARY KEY,
  stage_id INTEGER,
  paper_id INTEGER,
  mode TEXT NOT NULL,
  points_per_correct REAL DEFAULT 1,
  max_score REAL,
  metadata_json TEXT,
  tri_enabled INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (stage_id) REFERENCES stages (id),
  FOREIGN KEY (paper_id) REFERENCES papers (id)
);

CREATE TABLE content_releases (
  id INTEGER PRIMARY KEY,
  version TEXT UNIQUE NOT NULL,
  schema_version INTEGER NOT NULL,
  generated_at TEXT NOT NULL,
  notes TEXT
);

-- migrate:down
DROP TABLE IF EXISTS content_releases;

DROP TABLE IF EXISTS scoring_rules;

DROP TABLE IF EXISTS essay_evaluations;

DROP TABLE IF EXISTS essay_prompts;

DROP TABLE IF EXISTS question_relations;

DROP TABLE IF EXISTS study_plan_steps;

DROP TABLE IF EXISTS study_plans;

DROP TABLE IF EXISTS learning_map_edges;

DROP TABLE IF EXISTS learning_map_topics;

DROP TABLE IF EXISTS learning_maps;

DROP TABLE IF EXISTS learning_course_targets;

DROP TABLE IF EXISTS learning_course_topics;

DROP TABLE IF EXISTS learning_course_items;

DROP TABLE IF EXISTS learning_course_modules;

DROP TABLE IF EXISTS learning_courses;

DROP TABLE IF EXISTS assessment_set_items;

DROP TABLE IF EXISTS assessment_sets;

DROP TABLE IF EXISTS resource_topics;

DROP TABLE IF EXISTS resources;

DROP TABLE IF EXISTS lesson_topics;

DROP TABLE IF EXISTS lesson_sources;

DROP TABLE IF EXISTS lesson_sections;

DROP TABLE IF EXISTS lessons;

DROP TABLE IF EXISTS question_topics;

DROP TABLE IF EXISTS topic_relations;

DROP TABLE IF EXISTS curriculum_topics;

DROP TABLE IF EXISTS topic_subjects;

DROP TABLE IF EXISTS topics;

DROP TABLE IF EXISTS curricula;

DROP TABLE IF EXISTS question_sources;

DROP TABLE IF EXISTS grading_rubrics;

DROP TABLE IF EXISTS answer_key_options;

DROP TABLE IF EXISTS answer_keys;

DROP TABLE IF EXISTS question_parts;

DROP TABLE IF EXISTS question_options;

DROP TABLE IF EXISTS question_occurrences;

DROP TABLE IF EXISTS questions;

DROP TABLE IF EXISTS course_stage_requirements;

DROP TABLE IF EXISTS course_offerings;

DROP TABLE IF EXISTS admission_modalities;

DROP TABLE IF EXISTS degree_programs;

DROP TABLE IF EXISTS campuses;

DROP TABLE IF EXISTS paper_subjects;

DROP TABLE IF EXISTS subjects;

DROP TABLE IF EXISTS assessment_areas;

DROP TABLE IF EXISTS paper_versions;

DROP TABLE IF EXISTS languages;

DROP TABLE IF EXISTS papers;

DROP TABLE IF EXISTS stages;

DROP TABLE IF EXISTS source_documents;

DROP TABLE IF EXISTS editions;

DROP TABLE IF EXISTS admission_processes;

DROP TABLE IF EXISTS organizers;

DROP TABLE IF EXISTS universities;
