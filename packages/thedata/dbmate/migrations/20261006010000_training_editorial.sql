-- migrate:up
PRAGMA foreign_keys = ON;

ALTER TABLE questions
ADD COLUMN editorial_version TEXT NOT NULL DEFAULT '1.0.0';

ALTER TABLE questions
ADD COLUMN expected_seconds INTEGER CHECK (
  expected_seconds IS NULL
  OR expected_seconds > 0
);

CREATE TABLE curriculum_topic_stages (
  curriculum_topic_id INTEGER NOT NULL,
  stage_id INTEGER NOT NULL,
  is_required INTEGER NOT NULL DEFAULT 1 CHECK (is_required IN (0, 1)),
  source_document_id INTEGER,
  source_page INTEGER CHECK (
    source_page IS NULL
    OR source_page > 0
  ),
  source_excerpt TEXT,
  review_status TEXT NOT NULL DEFAULT 'draft' CHECK (review_status IN ('draft', 'review', 'published')),
  PRIMARY KEY (curriculum_topic_id, stage_id),
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id) ON DELETE CASCADE,
  FOREIGN KEY (stage_id) REFERENCES stages (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  CHECK (
    review_status <> 'published'
    OR source_document_id IS NOT NULL
  )
);

CREATE TABLE curriculum_topic_subjects (
  curriculum_topic_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
  PRIMARY KEY (curriculum_topic_id, subject_id),
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects (id)
);

CREATE UNIQUE INDEX curriculum_topic_one_primary_subject ON curriculum_topic_subjects (curriculum_topic_id)
WHERE
  is_primary = 1;

CREATE TABLE skills (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  is_published INTEGER NOT NULL DEFAULT 0 CHECK (is_published IN (0, 1))
);

INSERT INTO
  skills (slug, name, description, is_published)
VALUES
  (
    'interpretacao-de-representacoes',
    'Interpretação de representações',
    'Ler e relacionar textos, tabelas, gráficos, esquemas e outras representações.',
    1
  ),
  (
    'modelagem-matematica',
    'Modelagem matemática',
    'Traduzir situações em relações, funções, expressões ou modelos matemáticos.',
    1
  ),
  (
    'resolucao-de-problemas',
    'Resolução de problemas',
    'Selecionar estratégias e encadear procedimentos para resolver situações-problema.',
    1
  ),
  (
    'inferencia-e-argumentacao',
    'Inferência e argumentação',
    'Construir inferências e justificar conclusões com evidências.',
    1
  ),
  (
    'analise-de-variacao',
    'Análise de variação',
    'Reconhecer padrões, dependências, tendências e variações entre grandezas.',
    1
  );

CREATE TABLE question_skills (
  question_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'primary' CHECK (relation_type IN ('primary', 'secondary')),
  PRIMARY KEY (question_id, skill_id),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX question_one_primary_skill ON question_skills (question_id)
WHERE
  relation_type = 'primary';

CREATE TABLE curriculum_topic_skills (
  curriculum_topic_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  PRIMARY KEY (curriculum_topic_id, skill_id),
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);

CREATE TABLE question_solutions (
  id INTEGER PRIMARY KEY,
  question_id INTEGER NOT NULL,
  title TEXT NOT NULL DEFAULT 'Resolução',
  content TEXT NOT NULL,
  content_format TEXT NOT NULL DEFAULT 'markdown' CHECK (content_format IN ('markdown', 'plain_text')),
  position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  source_document_id INTEGER,
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id),
  UNIQUE (question_id, position)
);

CREATE TABLE question_hints (
  id INTEGER PRIMARY KEY,
  question_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  UNIQUE (question_id, position)
);

CREATE TABLE question_option_explanations (
  question_option_id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  diagnosis_code TEXT,
  FOREIGN KEY (question_option_id) REFERENCES question_options (id) ON DELETE CASCADE
);

CREATE TABLE canonical_question_sources (
  question_id INTEGER NOT NULL,
  source_document_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'reference',
  source_page INTEGER CHECK (
    source_page IS NULL
    OR source_page > 0
  ),
  note TEXT,
  PRIMARY KEY (question_id, source_document_id, role),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES source_documents (id)
);

CREATE TABLE canonical_question_relations (
  question_id INTEGER NOT NULL,
  related_question_id INTEGER NOT NULL,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('equivalent', 'variant', 'same_skill')),
  PRIMARY KEY (question_id, related_question_id, relation_type),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (related_question_id) REFERENCES questions (id) ON DELETE CASCADE,
  CHECK (question_id <> related_question_id),
  CHECK (
    relation_type = 'variant'
    OR question_id < related_question_id
  )
);

CREATE TABLE resource_assets (
  resource_id INTEGER NOT NULL,
  asset_id INTEGER NOT NULL,
  position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  PRIMARY KEY (resource_id, asset_id),
  UNIQUE (resource_id, position),
  FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES content_assets (id)
);

CREATE TABLE resource_targets (
  resource_id INTEGER NOT NULL,
  stage_id INTEGER NOT NULL,
  PRIMARY KEY (resource_id, stage_id),
  FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE,
  FOREIGN KEY (stage_id) REFERENCES stages (id) ON DELETE CASCADE
);

CREATE TABLE question_subjects (
  question_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
  PRIMARY KEY (question_id, subject_id),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects (id)
);

CREATE UNIQUE INDEX question_one_primary_subject ON question_subjects (question_id)
WHERE
  is_primary = 1;

CREATE TABLE assessment_blueprints (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  stage_id INTEGER NOT NULL,
  expected_question_count INTEGER NOT NULL CHECK (expected_question_count > 0),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  editorial_version TEXT NOT NULL DEFAULT '1.0.0',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  FOREIGN KEY (stage_id) REFERENCES stages (id) ON DELETE CASCADE
);

CREATE TABLE assessment_blueprint_rules (
  id INTEGER PRIMARY KEY,
  blueprint_id INTEGER NOT NULL,
  question_count INTEGER NOT NULL CHECK (question_count > 0),
  subject_id INTEGER,
  curriculum_topic_id INTEGER,
  skill_id INTEGER,
  difficulty TEXT,
  position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  FOREIGN KEY (blueprint_id) REFERENCES assessment_blueprints (id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects (id),
  FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics (id),
  FOREIGN KEY (skill_id) REFERENCES skills (id),
  UNIQUE (blueprint_id, position),
  CHECK (
    subject_id IS NOT NULL
    OR curriculum_topic_id IS NOT NULL
    OR skill_id IS NOT NULL
    OR difficulty IS NOT NULL
  )
);

ALTER TABLE assessment_sets
ADD COLUMN stage_id INTEGER REFERENCES stages (id);

ALTER TABLE assessment_sets
ADD COLUMN paper_id INTEGER REFERENCES papers (id);

ALTER TABLE assessment_sets
ADD COLUMN paper_version_id INTEGER REFERENCES paper_versions (id);

ALTER TABLE assessment_sets
ADD COLUMN blueprint_id INTEGER REFERENCES assessment_blueprints (id);

ALTER TABLE assessment_sets
ADD COLUMN editorial_version TEXT NOT NULL DEFAULT '1.0.0';

CREATE INDEX curriculum_topic_stages_stage_id ON curriculum_topic_stages (stage_id);

CREATE INDEX curriculum_topic_stages_source_document_id ON curriculum_topic_stages (source_document_id);

CREATE INDEX curriculum_topic_subjects_subject_id ON curriculum_topic_subjects (subject_id);

CREATE INDEX question_skills_skill_id ON question_skills (skill_id);

CREATE INDEX curriculum_topic_skills_skill_id ON curriculum_topic_skills (skill_id);

CREATE INDEX question_solutions_source_document_id ON question_solutions (source_document_id);

CREATE INDEX question_solutions_question_id ON question_solutions (question_id);

CREATE INDEX question_hints_question_id ON question_hints (question_id);

CREATE INDEX canonical_question_sources_source_document_id ON canonical_question_sources (source_document_id);

CREATE INDEX canonical_question_relations_related_question_id ON canonical_question_relations (related_question_id);

CREATE INDEX resource_assets_asset_id ON resource_assets (asset_id);

CREATE INDEX resource_targets_stage_id ON resource_targets (stage_id);

CREATE INDEX question_subjects_subject_id ON question_subjects (subject_id);

CREATE INDEX assessment_blueprint_rules_subject_id ON assessment_blueprint_rules (subject_id);

CREATE INDEX assessment_blueprint_rules_curriculum_topic_id ON assessment_blueprint_rules (curriculum_topic_id);

CREATE INDEX assessment_blueprint_rules_skill_id ON assessment_blueprint_rules (skill_id);

CREATE INDEX assessment_blueprints_stage_id ON assessment_blueprints (stage_id);

CREATE INDEX assessment_sets_stage_id ON assessment_sets (stage_id);

CREATE INDEX assessment_sets_paper_id ON assessment_sets (paper_id);

CREATE INDEX assessment_sets_paper_version_id ON assessment_sets (paper_version_id);

CREATE INDEX assessment_sets_blueprint_id ON assessment_sets (blueprint_id);

CREATE TRIGGER curriculum_topic_stages_integrity_insert BEFORE INSERT ON curriculum_topic_stages WHEN NOT EXISTS (
  SELECT
    1
  FROM
    curriculum_topics ct
    JOIN curricula c ON c.id = ct.curriculum_id
    JOIN stages st ON st.id = NEW.stage_id
  WHERE
    ct.id = NEW.curriculum_topic_id
    AND c.edition_id = st.edition_id
) BEGIN
SELECT
  RAISE (ABORT, 'curriculum topic and stage must belong to the same edition');

END;

CREATE TRIGGER curriculum_topic_stages_integrity_update BEFORE
UPDATE ON curriculum_topic_stages WHEN NOT EXISTS (
  SELECT
    1
  FROM
    curriculum_topics ct
    JOIN curricula c ON c.id = ct.curriculum_id
    JOIN stages st ON st.id = NEW.stage_id
  WHERE
    ct.id = NEW.curriculum_topic_id
    AND c.edition_id = st.edition_id
) BEGIN
SELECT
  RAISE (ABORT, 'curriculum topic and stage must belong to the same edition');

END;

CREATE TRIGGER curriculum_topic_subjects_integrity_insert BEFORE INSERT ON curriculum_topic_subjects WHEN NOT EXISTS (
  SELECT
    1
  FROM
    curriculum_topics ct
    JOIN curricula c ON c.id = ct.curriculum_id
    JOIN editions e ON e.id = c.edition_id
    JOIN stages st ON st.edition_id = e.id
    JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id = ct.id
    AND cts.stage_id = st.id
  WHERE
    ct.id = NEW.curriculum_topic_id
    AND st.id = cts.stage_id
) BEGIN
SELECT
  RAISE (ABORT, 'curriculum topic must be assigned to a phase before a phase-specific subject');

END;

CREATE TRIGGER curriculum_topic_subjects_integrity_update BEFORE
UPDATE ON curriculum_topic_subjects WHEN NOT EXISTS (
  SELECT
    1
  FROM
    curriculum_topics ct
    JOIN curricula c ON c.id = ct.curriculum_id
    JOIN editions e ON e.id = c.edition_id
    JOIN stages st ON st.edition_id = e.id
    JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id = ct.id
    AND cts.stage_id = st.id
  WHERE
    ct.id = NEW.curriculum_topic_id
    AND st.id = cts.stage_id
) BEGIN
SELECT
  RAISE (ABORT, 'curriculum topic must be assigned to a phase before a phase-specific subject');

END;

CREATE TRIGGER question_relation_prevent_cycle_insert BEFORE INSERT ON topic_relations WHEN NEW.relation_type IN ('parent', 'prerequisite')
AND EXISTS (
  WITH RECURSIVE
    reachable (id) AS (
      SELECT
        related_topic_id
      FROM
        topic_relations
      WHERE
        topic_id = NEW.related_topic_id
        AND relation_type = NEW.relation_type
      UNION
      SELECT
        tr.related_topic_id
      FROM
        topic_relations tr
        JOIN reachable r ON tr.topic_id = r.id
      WHERE
        tr.relation_type = NEW.relation_type
    )
  SELECT
    1
  FROM
    reachable
  WHERE
    id = NEW.topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'topic relation would create a cycle');

END;

CREATE TRIGGER question_relation_prevent_cycle_update BEFORE
UPDATE ON topic_relations WHEN NEW.relation_type IN ('parent', 'prerequisite')
AND EXISTS (
  WITH RECURSIVE
    reachable (id) AS (
      SELECT
        related_topic_id
      FROM
        topic_relations
      WHERE
        topic_id = NEW.related_topic_id
        AND relation_type = NEW.relation_type
        AND NOT (
          topic_id = OLD.topic_id
          AND related_topic_id = OLD.related_topic_id
          AND relation_type = OLD.relation_type
        )
      UNION
      SELECT
        tr.related_topic_id
      FROM
        topic_relations tr
        JOIN reachable r ON tr.topic_id = r.id
      WHERE
        tr.relation_type = NEW.relation_type
    )
  SELECT
    1
  FROM
    reachable
  WHERE
    id = NEW.topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'topic relation would create a cycle');

END;

CREATE TRIGGER learning_map_edge_prevent_cycle_insert BEFORE INSERT ON learning_map_edges WHEN EXISTS (
  WITH RECURSIVE
    reachable (id) AS (
      SELECT
        to_topic_id
      FROM
        learning_map_edges
      WHERE
        map_id = NEW.map_id
        AND from_topic_id = NEW.to_topic_id
      UNION
      SELECT
        edge.to_topic_id
      FROM
        learning_map_edges edge
        JOIN reachable r ON edge.from_topic_id = r.id
      WHERE
        edge.map_id = NEW.map_id
    )
  SELECT
    1
  FROM
    reachable
  WHERE
    id = NEW.from_topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'learning map edge would create a cycle');

END;

CREATE TRIGGER learning_map_edge_prevent_cycle_update BEFORE
UPDATE ON learning_map_edges WHEN EXISTS (
  WITH RECURSIVE
    reachable (id) AS (
      SELECT
        to_topic_id
      FROM
        learning_map_edges
      WHERE
        map_id = NEW.map_id
        AND from_topic_id = NEW.to_topic_id
        AND NOT (
          map_id = OLD.map_id
          AND from_topic_id = OLD.from_topic_id
          AND to_topic_id = OLD.to_topic_id
          AND relation_type = OLD.relation_type
        )
      UNION
      SELECT
        edge.to_topic_id
      FROM
        learning_map_edges edge
        JOIN reachable r ON edge.from_topic_id = r.id
      WHERE
        edge.map_id = NEW.map_id
    )
  SELECT
    1
  FROM
    reachable
  WHERE
    id = NEW.from_topic_id
) BEGIN
SELECT
  RAISE (ABORT, 'learning map edge would create a cycle');

END;

CREATE TRIGGER canonical_question_relations_no_owner_cycle_insert BEFORE INSERT ON canonical_question_relations WHEN NEW.relation_type = 'equivalent'
AND EXISTS (
  SELECT
    1
  FROM
    canonical_question_relations
  WHERE
    relation_type = 'equivalent'
    AND question_id = NEW.related_question_id
    AND related_question_id = NEW.question_id
) BEGIN
SELECT
  RAISE (ABORT, 'equivalent question relation is already stored in canonical order');

END;

CREATE TRIGGER assessment_set_source_integrity_insert BEFORE INSERT ON assessment_sets WHEN (
  NEW.paper_version_id IS NOT NULL
  AND (
    NEW.paper_id IS NULL
    OR NOT EXISTS (
      SELECT
        1
      FROM
        paper_versions pv
      WHERE
        pv.id = NEW.paper_version_id
        AND pv.paper_id = NEW.paper_id
    )
  )
)
OR (
  NEW.paper_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      papers p
    WHERE
      p.id = NEW.paper_id
      AND p.stage_id = NEW.stage_id
  )
)
OR (
  NEW.stage_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      stages st
      JOIN editions e ON e.id = st.edition_id
    WHERE
      st.id = NEW.stage_id
      AND (
        NEW.edition_id IS NULL
        OR e.id = NEW.edition_id
      )
      AND (
        NEW.admission_process_id IS NULL
        OR e.admission_process_id = NEW.admission_process_id
      )
  )
)
OR (
  NEW.kind = 'exam'
  AND NEW.is_published = 1
  AND (
    NEW.stage_id IS NULL
    OR NEW.paper_id IS NULL
    OR NEW.expected_question_count IS NULL
    OR NEW.duration_minutes IS NULL
  )
) BEGIN
SELECT
  RAISE (ABORT, 'assessment source or official exam metadata is inconsistent');

END;

CREATE TRIGGER assessment_set_source_integrity_update BEFORE
UPDATE ON assessment_sets WHEN (
  NEW.paper_version_id IS NOT NULL
  AND (
    NEW.paper_id IS NULL
    OR NOT EXISTS (
      SELECT
        1
      FROM
        paper_versions pv
      WHERE
        pv.id = NEW.paper_version_id
        AND pv.paper_id = NEW.paper_id
    )
  )
)
OR (
  NEW.paper_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      papers p
    WHERE
      p.id = NEW.paper_id
      AND p.stage_id = NEW.stage_id
  )
)
OR (
  NEW.stage_id IS NOT NULL
  AND NOT EXISTS (
    SELECT
      1
    FROM
      stages st
      JOIN editions e ON e.id = st.edition_id
    WHERE
      st.id = NEW.stage_id
      AND (
        NEW.edition_id IS NULL
        OR e.id = NEW.edition_id
      )
      AND (
        NEW.admission_process_id IS NULL
        OR e.admission_process_id = NEW.admission_process_id
      )
  )
)
OR (
  NEW.kind = 'exam'
  AND NEW.is_published = 1
  AND (
    NEW.stage_id IS NULL
    OR NEW.paper_id IS NULL
    OR NEW.expected_question_count IS NULL
    OR NEW.duration_minutes IS NULL
  )
) BEGIN
SELECT
  RAISE (ABORT, 'assessment source or official exam metadata is inconsistent');

END;

CREATE TRIGGER assessment_blueprint_publish_integrity BEFORE
UPDATE ON assessment_blueprints WHEN NEW.status = 'published'
AND (
  NOT EXISTS (
    SELECT
      1
    FROM
      assessment_blueprint_rules
    WHERE
      blueprint_id = NEW.id
  )
  OR (
    SELECT
      COALESCE(SUM(question_count), 0)
    FROM
      assessment_blueprint_rules
    WHERE
      blueprint_id = NEW.id
  ) <> NEW.expected_question_count
  OR EXISTS (
    SELECT
      1
    FROM
      assessment_blueprint_rules r
      JOIN curriculum_topics ct ON ct.id = r.curriculum_topic_id
      JOIN curricula c ON c.id = ct.curriculum_id
    WHERE
      r.blueprint_id = NEW.id
      AND c.edition_id <> (
        SELECT
          edition_id
        FROM
          stages
        WHERE
          id = NEW.stage_id
      )
  )
  OR EXISTS (
    SELECT
      1
    FROM
      assessment_blueprint_rules r
    WHERE
      r.blueprint_id = NEW.id
      AND r.curriculum_topic_id IS NOT NULL
      AND NOT EXISTS (
        SELECT
          1
        FROM
          curriculum_topic_stages cts
        WHERE
          cts.curriculum_topic_id = r.curriculum_topic_id
          AND cts.stage_id = NEW.stage_id
          AND cts.review_status = 'published'
      )
  )
  OR EXISTS (
    SELECT
      1
    FROM
      assessment_blueprint_rules r
    WHERE
      r.blueprint_id = NEW.id
      AND r.skill_id IS NOT NULL
      AND r.curriculum_topic_id IS NOT NULL
      AND NOT EXISTS (
        SELECT
          1
        FROM
          curriculum_topic_skills cts
        WHERE
          cts.curriculum_topic_id = r.curriculum_topic_id
          AND cts.skill_id = r.skill_id
      )
  )
) BEGIN
SELECT
  RAISE (ABORT, 'published blueprint rules must fully match its question count');

END;

CREATE TRIGGER assessment_blueprint_publish_integrity_insert BEFORE INSERT ON assessment_blueprints WHEN NEW.status = 'published' BEGIN
SELECT
  RAISE (ABORT, 'create and validate blueprint rules before publishing');

END;

CREATE TRIGGER assessment_blueprint_published_rule_insert BEFORE INSERT ON assessment_blueprint_rules WHEN EXISTS (
  SELECT
    1
  FROM
    assessment_blueprints
  WHERE
    id = NEW.blueprint_id
    AND status = 'published'
) BEGIN
SELECT
  RAISE (ABORT, 'unpublish the blueprint before changing its rules');

END;

CREATE TRIGGER assessment_blueprint_published_rule_update BEFORE
UPDATE ON assessment_blueprint_rules WHEN EXISTS (
  SELECT
    1
  FROM
    assessment_blueprints
  WHERE
    id IN (OLD.blueprint_id, NEW.blueprint_id)
    AND status = 'published'
) BEGIN
SELECT
  RAISE (ABORT, 'unpublish the blueprint before changing its rules');

END;

CREATE TRIGGER assessment_blueprint_published_rule_delete BEFORE DELETE ON assessment_blueprint_rules WHEN EXISTS (
  SELECT
    1
  FROM
    assessment_blueprints
  WHERE
    id = OLD.blueprint_id
    AND status = 'published'
) BEGIN
SELECT
  RAISE (ABORT, 'unpublish the blueprint before changing its rules');

END;

INSERT INTO
  canonical_question_sources (question_id, source_document_id, role, source_page)
SELECT
  qo.question_id,
  qs.source_document_id,
  qs.role,
  MIN(qo.source_page)
FROM
  question_sources qs
  JOIN question_occurrences qo ON qo.id = qs.question_occurrence_id
GROUP BY
  qo.question_id,
  qs.source_document_id,
  qs.role;

INSERT INTO
  question_subjects (question_id, subject_id, is_primary)
WITH
  candidates AS (
    SELECT
      qo.question_id,
      qo.subject_id
    FROM
      question_occurrences qo
    WHERE
      qo.subject_id IS NOT NULL
    UNION
    SELECT
      qo.question_id,
      ts.subject_id
    FROM
      question_topics qt
      JOIN question_occurrences qo ON qo.id = qt.question_occurrence_id
      JOIN curriculum_topics ct ON ct.id = qt.curriculum_topic_id
      JOIN topic_subjects ts ON ts.topic_id = ct.topic_id
    UNION
    SELECT
      cqt.question_id,
      ts.subject_id
    FROM
      canonical_question_topics cqt
      JOIN topic_subjects ts ON ts.topic_id = cqt.topic_id
  )
SELECT
  question_id,
  subject_id,
  CASE
    WHEN COUNT(*) OVER (
      PARTITION BY
        question_id
    ) = 1 THEN 1
    ELSE 0
  END
FROM
  candidates;

INSERT INTO
  question_solutions (question_id, title, content, position)
SELECT
  id,
  'Resolução',
  explanation,
  0
FROM
  questions
WHERE
  explanation IS NOT NULL
  AND TRIM(explanation) <> '';

-- migrate:down
DROP TRIGGER IF EXISTS assessment_blueprint_publish_integrity;

DROP TRIGGER IF EXISTS assessment_blueprint_publish_integrity_insert;

DROP TRIGGER IF EXISTS assessment_blueprint_published_rule_insert;

DROP TRIGGER IF EXISTS assessment_blueprint_published_rule_update;

DROP TRIGGER IF EXISTS assessment_blueprint_published_rule_delete;

DROP TRIGGER IF EXISTS learning_map_edge_prevent_cycle_update;

DROP TRIGGER IF EXISTS question_relation_prevent_cycle_update;

DROP TRIGGER IF EXISTS assessment_set_source_integrity_update;

DROP TRIGGER IF EXISTS assessment_set_source_integrity_insert;

DROP TRIGGER IF EXISTS canonical_question_relations_no_owner_cycle_insert;

DROP TRIGGER IF EXISTS learning_map_edge_prevent_cycle_insert;

DROP TRIGGER IF EXISTS question_relation_prevent_cycle_insert;

DROP TRIGGER IF EXISTS curriculum_topic_subjects_integrity_update;

DROP TRIGGER IF EXISTS curriculum_topic_subjects_integrity_insert;

DROP TRIGGER IF EXISTS curriculum_topic_stages_integrity_update;

DROP TRIGGER IF EXISTS curriculum_topic_stages_integrity_insert;

DROP INDEX IF EXISTS assessment_sets_blueprint_id;

DROP INDEX IF EXISTS assessment_sets_paper_version_id;

DROP INDEX IF EXISTS assessment_sets_paper_id;

DROP INDEX IF EXISTS assessment_sets_stage_id;

DROP INDEX IF EXISTS assessment_blueprints_stage_id;

DROP INDEX IF EXISTS assessment_blueprint_rules_skill_id;

DROP INDEX IF EXISTS assessment_blueprint_rules_curriculum_topic_id;

DROP INDEX IF EXISTS assessment_blueprint_rules_subject_id;

DROP INDEX IF EXISTS question_subjects_subject_id;

DROP INDEX IF EXISTS resource_targets_stage_id;

DROP INDEX IF EXISTS resource_assets_asset_id;

DROP INDEX IF EXISTS canonical_question_relations_related_question_id;

DROP INDEX IF EXISTS canonical_question_sources_source_document_id;

DROP INDEX IF EXISTS question_solutions_source_document_id;

DROP INDEX IF EXISTS question_solutions_question_id;

DROP INDEX IF EXISTS question_hints_question_id;

DROP INDEX IF EXISTS curriculum_topic_skills_skill_id;

DROP INDEX IF EXISTS question_skills_skill_id;

DROP INDEX IF EXISTS curriculum_topic_subjects_subject_id;

DROP INDEX IF EXISTS curriculum_topic_stages_stage_id;

DROP INDEX IF EXISTS curriculum_topic_stages_source_document_id;

DROP INDEX IF EXISTS question_one_primary_subject;

DROP INDEX IF EXISTS question_one_primary_skill;

DROP INDEX IF EXISTS curriculum_topic_one_primary_subject;

DROP TABLE IF EXISTS assessment_blueprint_rules;

DROP TABLE IF EXISTS assessment_blueprints;

DROP TABLE IF EXISTS question_subjects;

DROP TABLE IF EXISTS resource_targets;

DROP TABLE IF EXISTS resource_assets;

DROP TABLE IF EXISTS canonical_question_relations;

DROP TABLE IF EXISTS canonical_question_sources;

DROP TABLE IF EXISTS question_option_explanations;

DROP TABLE IF EXISTS question_hints;

DROP TABLE IF EXISTS question_solutions;

DROP TABLE IF EXISTS curriculum_topic_skills;

DROP TABLE IF EXISTS question_skills;

DROP TABLE IF EXISTS skills;

DROP TABLE IF EXISTS curriculum_topic_subjects;

DROP TABLE IF EXISTS curriculum_topic_stages;

ALTER TABLE assessment_sets
DROP COLUMN editorial_version;

ALTER TABLE assessment_sets
DROP COLUMN blueprint_id;

ALTER TABLE assessment_sets
DROP COLUMN paper_version_id;

ALTER TABLE assessment_sets
DROP COLUMN paper_id;

ALTER TABLE assessment_sets
DROP COLUMN stage_id;

ALTER TABLE questions
DROP COLUMN expected_seconds;

ALTER TABLE questions
DROP COLUMN editorial_version;
