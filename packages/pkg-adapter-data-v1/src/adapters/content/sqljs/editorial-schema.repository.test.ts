import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import initSqlJs from "sql.js";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { validateContentDatabaseSchema } from "./database/validate-content-database-schema.function";
import { readContentAssessment } from "./read-content-assessment.function";
import { readContentQuestion } from "./read-content-question.function";
import { readContentTopic } from "./read-content-topic.function";
import { readTopicQuestions } from "./read-topic-questions.function";
import { SqlJsContentRepository } from "./sql-js-content.repository";
import type { ContentDatabase } from "./database/content-database.type";
import type { Database, SqlJs } from "sql.js";

let repositoryDirectory = process.cwd();

while (!existsSync(path.resolve(repositoryDirectory, "packages/thedata/dbmate/migrations"))) {
  const parentDirectory = path.dirname(repositoryDirectory);

  if (parentDirectory === repositoryDirectory) {
    throw new Error("Could not find the repository migrations directory.");
  }

  repositoryDirectory = parentDirectory;
}

const migrationsDirectory = path.resolve(repositoryDirectory, "packages/thedata/dbmate/migrations");

const migrations = readdirSync(migrationsDirectory)
  .filter((name) => {
    return name.endsWith(".sql");
  })
  .sort()
  .map((name) => {
    const source = readFileSync(path.join(migrationsDirectory, name), "utf8");

    return {
      name,
      up: source.split("-- migrate:up")[1].split("-- migrate:down")[0],
      down: source.split("-- migrate:down")[1],
    };
  });

const fixtureSql = `
INSERT INTO admission_processes (id, slug, name, kind) VALUES
  (1, 'fixture-selection', 'Seleção sintética de teste', 'vestibular'),
  (2, 'fixture-other', 'Outra seleção sintética', 'vestibular');
INSERT INTO editions (id, admission_process_id, year, slug, name) VALUES
  (1, 1, 2026, 'fixture-2026', 'Edição sintética 2026'),
  (2, 2, 2025, 'fixture-2025', 'Edição sintética 2025');
INSERT INTO stages (id, edition_id, slug, name, kind) VALUES
  (1, 1, 'first', 'Primeira fase sintética', 'objective'),
  (2, 2, 'first', 'Fase de outra edição', 'objective');
INSERT INTO source_documents (id, title, url, kind) VALUES
  (1, 'Caderno sintético', 'https://example.invalid/test-paper', 'pdf');
INSERT INTO papers (id, stage_id, slug, name, duration_minutes, source_document_id) VALUES
  (1, 1, 'first', 'Prova sintética de 72 questões', 300, 1),
  (2, 2, 'other', 'Prova de outra edição', 240, 1);
INSERT INTO paper_versions (id, paper_id, code, name) VALUES
  (1, 1, 'A', 'Caderno sintético A'),
  (2, 1, 'B', 'Caderno sintético B'),
  (3, 2, 'X', 'Caderno de outra prova');
INSERT INTO subjects (id, slug, name) VALUES
  (1, 'language', 'Linguagens'), (2, 'mathematics', 'Matemática'),
  (3, 'history', 'História'), (4, 'geography', 'Geografia'),
  (5, 'biology', 'Biologia'), (6, 'physics', 'Física');
INSERT INTO topics (id, slug, name) VALUES
  (1, 'reading', 'Leitura'), (2, 'functions', 'Funções'),
  (3, 'society', 'Sociedade'), (4, 'territory', 'Território'),
  (5, 'ecology', 'Ecologia'), (6, 'mechanics', 'Mecânica');
INSERT INTO curricula (id, edition_id, name) VALUES
  (1, 1, 'Programa sintético'), (2, 2, 'Outro programa');
INSERT INTO curriculum_topics (id, curriculum_id, topic_id, label) SELECT
  id, 1, id, name FROM topics;
INSERT INTO curriculum_topics (id, curriculum_id, topic_id, label) VALUES
  (101, 2, 1, 'Leitura de outro programa');
WITH RECURSIVE n(value) AS (SELECT 1 UNION ALL SELECT value + 1 FROM n WHERE value < 72)
INSERT INTO questions (id, slug, type, statement, explanation) SELECT
  value, 'fixture-question-' || value, 'single_choice',
  'Questão sintética ' || value || ': interprete o contexto e escolha a conclusão.',
  'Explicação sintética para avaliar a identidade da resposta.' FROM n;
INSERT INTO questions (id, slug, type, statement) VALUES
  (73, 'fixture-independent', 'single_choice', 'Exercício autoral sem edição ou ocorrência.');
WITH options(code, position) AS (VALUES ('A', 0), ('B', 1), ('C', 2), ('D', 3))
INSERT INTO question_options (id, question_id, code, text, position) SELECT
  q.id * 10 + o.position, q.id, o.code,
  'Conclusão sintética ' || o.code || ' da questão ' || q.id, o.position FROM questions q CROSS JOIN options o;
INSERT INTO question_parts (id, question_id, code, label) VALUES
  (1, 1, 'a', 'Subitem sintético'), (2, 2, 'a', 'Subitem de outra questão');
INSERT INTO question_occurrences
  (id, question_id, paper_id, paper_version_id, subject_id, occurrence_key, number, source_document_id, source_page)
SELECT q.id, q.id, 1, 1, ((q.id - 1) % 6) + 1,
  'fixture:a:' || q.id, q.id, 1, CAST((q.id + 3) / 4 AS INTEGER) FROM questions q WHERE q.id <= 72;
INSERT INTO question_occurrences
  (id, question_id, paper_id, paper_version_id, subject_id, occurrence_key, number, original_number, source_document_id, source_page)
SELECT q.id + 100, q.id, 1, 2, ((q.id - 1) % 6) + 1,
  'fixture:b:' || q.id, 73 - q.id, q.id, 1, CAST((76 - q.id) / 4 AS INTEGER) FROM questions q WHERE q.id <= 72;
INSERT INTO canonical_question_topics (question_id, topic_id) SELECT id, ((id - 1) % 6) + 1 FROM questions;
INSERT INTO question_topics (question_occurrence_id, curriculum_topic_id) SELECT id, subject_id FROM question_occurrences;
INSERT INTO question_occurrence_options (occurrence_id, question_option_id, code, position)
SELECT qo.id, opt.id, opt.code, opt.position FROM question_occurrences qo
JOIN question_options opt ON opt.question_id = qo.question_id WHERE qo.paper_version_id = 1;
INSERT INTO question_occurrence_options (occurrence_id, question_option_id, code, position)
SELECT qo.id, opt.id, char(65 + ((opt.position + 1) % 4)), (opt.position + 1) % 4 FROM question_occurrences qo
JOIN question_options opt ON opt.question_id = qo.question_id WHERE qo.paper_version_id = 2;
INSERT INTO canonical_answer_keys
  (id, question_id, version, status, answer_type, answer_value, is_automatically_gradable, max_points)
SELECT id, id, 1, 'definitive', 'single_choice', 'A', 1, 1 FROM questions;
INSERT INTO canonical_answer_key_options (answer_key_id, question_option_id) SELECT id, id * 10 FROM questions;
INSERT INTO answer_keys (id, question_occurrence_id, answer_type, answer_value, is_automatically_gradable)
VALUES (1, 1, 'single_choice', 'A', 1);
INSERT INTO answer_key_options (answer_key_id, question_option_id) VALUES (1, 10);
INSERT INTO stimuli (id, slug, title, content, source_document_id, source_page) VALUES
  (1, 'fixture-shared', 'Texto compartilhado sintético', 'Contexto usado por três questões de teste.', 1, 1);
INSERT INTO content_assets (id, path, media_type, alt_text, source_document_id) VALUES
  (1, 'test-assets/fixture-chart.svg', 'image/svg+xml', 'Gráfico sintético com duas séries.', 1);
INSERT INTO question_stimuli (question_id, stimulus_id, position) VALUES (1, 1, 0), (2, 1, 0), (3, 1, 0);
INSERT INTO stimulus_assets (stimulus_id, asset_id, position) VALUES (1, 1, 0);
INSERT INTO question_assets (question_id, asset_id, position) VALUES (5, 1, 0);
INSERT INTO lessons (id, slug, title) VALUES (1, 'fixture-lesson', 'Aula sintética');
INSERT INTO resources (id, title, url, provider) VALUES
  (1, 'Material sintético', 'https://example.invalid/test-resource', 'Fixture');
INSERT INTO learning_courses (id, slug, title) VALUES
  (1, 'fixture-course', 'Curso sintético'), (2, 'fixture-other-course', 'Outro curso');
INSERT INTO learning_course_modules (id, learning_course_id, slug, title) VALUES
  (1, 1, 'basics', 'Fundamentos'), (2, 2, 'basics', 'Outro módulo');
INSERT INTO assessment_sets (id, slug, title, edition_id, admission_process_id, duration_minutes, expected_question_count) VALUES
  (1, 'fixture-simulation-a', 'Simulado sintético A', 1, 1, 300, 72),
  (2, 'fixture-simulation-b', 'Simulado sintético B', 1, 1, 300, 72),
  (3, 'fixture-independent-practice', 'Prática independente', NULL, NULL, NULL, NULL);
INSERT INTO assessment_set_items (assessment_set_id, position, item_type, question_occurrence_id, points)
SELECT paper_version_id, number, 'question', id, 1 FROM question_occurrences;
INSERT INTO assessment_set_items (assessment_set_id, position, item_type, question_id) VALUES (3, 1, 'question', 73);
INSERT INTO learning_course_items (id, module_id, item_type, title, position, lesson_id, question_occurrence_id, question_id, assessment_set_id)
VALUES (1, 1, 'lesson', 'Teoria', 0, 1, NULL, NULL, NULL),
  (2, 1, 'practice', 'Prática autoral', 1, NULL, NULL, 73, NULL),
  (3, 1, 'assessment', 'Simulado', 2, NULL, NULL, NULL, 1),
  (4, 1, 'practice', 'Prática histórica', 3, NULL, 1, NULL, NULL);
INSERT INTO universities (id, slug, name) VALUES
  (1, 'fixture-university', 'Universidade sintética'), (2, 'fixture-other-university', 'Outra universidade');
INSERT INTO campuses (id, university_id, name) VALUES (1, 1, 'Campus sintético');
INSERT INTO degree_programs (id, university_id, campus_id, slug, name) VALUES (1, 1, 1, 'fixture-degree', 'Curso universitário');
INSERT INTO course_offerings (id, edition_id, degree_program_id) VALUES (1, 1, 1);
INSERT INTO course_stage_requirements (course_offering_id, stage_id, paper_id) VALUES (1, 1, NULL);
INSERT INTO study_plans (id, slug, title, learning_course_id) VALUES (1, 'fixture-plan', 'Plano sintético', 1);
INSERT INTO study_plan_steps (id, study_plan_id, position, title, module_id, item_id) VALUES (1, 1, 0, 'Teoria', 1, 1);
INSERT INTO learning_maps (id, slug, title, edition_id, admission_process_id) VALUES (1, 'fixture-map', 'Mapa sintético', 1, 1);
INSERT INTO learning_map_topics (map_id, curriculum_topic_id) VALUES (1, 1), (1, 2);
INSERT INTO learning_map_edges (map_id, from_topic_id, to_topic_id) VALUES (1, 1, 2);
`;

describe("editorial schema migrations against real sql.js SQLite", () => {
  let engine: SqlJs;

  let database: Database;

  beforeAll(async () => {
    const requireModule = createRequire(import.meta.url);

    engine = await initSqlJs({
      locateFile: () => {
        return requireModule.resolve("sql.js/dist/sql-wasm.wasm");
      },
    });
  });

  beforeEach(() => {
    database = new engine.Database();

    database.exec("PRAGMA foreign_keys = ON; BEGIN;");

    migrations.forEach((migration) => {
      database.exec(migration.up);
    });

    database.exec(fixtureSql);

    database.exec("COMMIT;");
  });

  afterEach(() => {
    database.close();
  });

  it("backfills existing question solutions as published and defaults new ones to review", () => {
    const legacyDatabase = new engine.Database();
    legacyDatabase.exec("PRAGMA foreign_keys = ON;");

    migrations.slice(0, -1).forEach((migration) => {
      legacyDatabase.exec(migration.up);
    });
    legacyDatabase.exec(fixtureSql);
    legacyDatabase.exec(
      "INSERT INTO question_solutions (id, question_id, title, content, position) VALUES (501, 1, 'Resolução existente', 'Texto preservado', 0)",
    );
    legacyDatabase.exec(migrations.at(-1)!.up);

    expect(legacyDatabase.exec(
      "SELECT id, title, content, editorial_status, editorial_version, authorship FROM question_solutions WHERE id = 501",
    )[0].values).toEqual([[501, "Resolução existente", "Texto preservado", "published", null, null]]);

    legacyDatabase.exec(
      "INSERT INTO question_solutions (id, question_id, title, content, position) VALUES (502, 2, 'Nova resolução', 'Conteúdo em revisão', 0)",
    );

    expect(legacyDatabase.exec(
      "SELECT editorial_status FROM question_solutions WHERE id = 502",
    )[0].values).toEqual([["review"]]);

    legacyDatabase.close();
  });

  it("reads solution editorial metadata and remains compatible with pre-status databases", () => {
    const createContentDatabase = (sourceDatabase: Database): ContentDatabase => ({
      source: "fixture",
      get(sql, params) {
        return this.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = sourceDatabase.exec(sql, params)[0];

        return result
          ? result.values.map((values) => Object.fromEntries(
            result.columns.map((column, index) => [column, values[index]]),
          ))
          : [];
      },
    });

    database.exec(
      "INSERT INTO question_solutions (id, question_id, title, content, position, editorial_status, editorial_version, authorship) VALUES (701, 1, 'Resolução editorial', 'Raciocínio revisado.', 0, 'review', '1.0.0', 'original_editorial')",
    );
    const currentSolution = readContentQuestion(createContentDatabase(database), "question:1")?.solutions?.[0];

    expect(currentSolution).toMatchObject({
      id: 701,
      editorialStatus: "review",
      editorialVersion: "1.0.0",
      authorship: "original_editorial",
    });

    const legacyDatabase = new engine.Database();
    legacyDatabase.exec("PRAGMA foreign_keys = ON;");
    migrations.slice(0, -1).forEach((migration) => {
      legacyDatabase.exec(migration.up);
    });
    legacyDatabase.exec(fixtureSql);
    legacyDatabase.exec(
      "INSERT INTO question_solutions (id, question_id, title, content, position) VALUES (702, 1, 'Resolução legada', 'Conteúdo existente.', 0)",
    );

    const legacySolution = readContentQuestion(createContentDatabase(legacyDatabase), "question:1")?.solutions?.[0];

    expect(legacySolution).toMatchObject({
      id: 702,
      editorialStatus: "published",
      editorialVersion: null,
      authorship: null,
    });

    legacyDatabase.close();
  });

  it("loads two 72-question booklets, one standalone exercise and shared resources", () => {
    expect(
      database.exec(
        "SELECT paper_version_id, COUNT(*), MIN(number), MAX(number) FROM question_occurrences GROUP BY paper_version_id",
      )[0].values,
    )
      .toEqual([
        [1, 72, 1, 72],
        [2, 72, 1, 72],
      ]);

    expect(
      database.exec(
        "SELECT assessment_set_id, COUNT(*), SUM(points) FROM assessment_set_items WHERE question_occurrence_id IS NOT NULL GROUP BY assessment_set_id",
      )[0].values,
    )
      .toEqual([
        [1, 72, 72],
        [2, 72, 72],
      ]);

    expect(
      database.exec(
        "SELECT q.id, cqt.topic_id, ak.answer_value FROM questions q JOIN canonical_question_topics cqt ON cqt.question_id = q.id JOIN canonical_answer_keys ak ON ak.question_id = q.id LEFT JOIN question_occurrences qo ON qo.question_id = q.id WHERE qo.id IS NULL",
      )[0].values,
    )
      .toEqual([[73, 1, "A"]]);

    expect(
      database.exec(
        "SELECT COUNT(DISTINCT qs.question_id), COUNT(DISTINCT s.id), COUNT(DISTINCT a.id) FROM question_stimuli qs JOIN stimuli s ON s.id = qs.stimulus_id JOIN stimulus_assets sa ON sa.stimulus_id = s.id JOIN content_assets a ON a.id = sa.asset_id",
      )[0].values,
    )
      .toEqual([[3, 1, 1]]);

    expect(database.exec("PRAGMA foreign_key_check"))
      .toEqual([]);

    expect(database.exec("PRAGMA integrity_check")[0].values)
      .toEqual([["ok"]]);
  });

  it("rejects content databases with broken foreign-key relations", () => {
    database.exec("PRAGMA foreign_keys = OFF;");

    database.exec("INSERT INTO lesson_topics (lesson_id, topic_id) VALUES (999, 999);");

    expect(() => {
      return validateContentDatabaseSchema(database);
    })
      .toThrow(/foreign-key violation/);
  });

  it("can roll back the training schema migration without corrupting the previous editorial schema", () => {
    database.exec(migrations.at(-1)!.down);

    expect(database.exec("PRAGMA foreign_key_check"))
      .toEqual([]);

    expect(database.exec("PRAGMA integrity_check")[0].values)
      .toEqual([["ok"]]);

    expect(() => {
      return database.exec("SELECT id, slug, type, statement, status FROM questions LIMIT 0");
    }).not.toThrow();
  });

  it("preserves canonical option identity across shuffled numbers and labels", () => {
    expect(
      database.exec(
        "SELECT qo.id, qo.question_id, qo.number, o.code, o.position, o.question_option_id FROM question_occurrences qo JOIN question_occurrence_options o ON o.occurrence_id = qo.id JOIN canonical_answer_key_options ako ON ako.question_option_id = o.question_option_id JOIN canonical_answer_keys ak ON ak.id = ako.answer_key_id AND ak.question_id = qo.question_id WHERE qo.question_id = 1 ORDER BY qo.id",
      )[0].values,
    )
      .toEqual([
        [1, 1, 1, "A", 0, 10],
        [101, 1, 72, "B", 1, 10],
      ]);
  });

  it("resolves topic resources from the scoped curriculum mapping without a legacy canonical alias", () => {
    database.exec(
      "INSERT INTO canonical_topics (id, slug, name, status) VALUES (1, 'canonical-reading', 'Leitura', 'published')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_canonical_topics (curriculum_topic_id, canonical_topic_id, relation_type, source_document_id, review_status) VALUES (1, 1, 'primary', 1, 'published')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_stages (curriculum_topic_id, stage_id, source_document_id, review_status) VALUES (1, 1, 1, 'published')",
    );
    database.exec("UPDATE source_documents SET is_official = 1 WHERE id = 1");
    database.exec(
      "UPDATE resources SET is_published = 1, editorial_status = 'published', availability_mode = 'learning', is_free = 1 WHERE id = 1",
    );
    database.exec(
      "INSERT INTO resource_topics (resource_id, curriculum_topic_id, review_status, relevance_status, accessibility_status) VALUES (1, 1, 'published', 'relevant', 'checked')",
    );
    database.exec("INSERT INTO resource_targets (resource_id, stage_id) VALUES (1, 1)");

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        return result
          ? result.values.map((values) => {
            return Object.fromEntries(
              result.columns.map((column, index) => {
                return [column, values[index]];
              }),
            );
          })
          : [];
      },
    };

    const topic = readContentTopic(contentDatabase, "reading", {
      targetEditionSlug: "fixture-2026",
      targetStageSlug: "first",
    });

    expect(topic?.curriculum?.official).toBe(true);
    expect(topic?.curriculum?.canonicalMappingStatus).toBe("published");
    expect(topic?.resources.map((resource) => { return resource.title; }))
      .toContain("Material sintético");
  });

  it("resolves legacy canonical resource links on an annual curriculum topic", () => {
    database.exec(
      "INSERT INTO canonical_topics (id, slug, name, status) VALUES (1, 'canonical-reading', 'Leitura', 'published')",
    );
    database.exec(
      "INSERT INTO canonical_topic_legacy_topics (canonical_topic_id, topic_id) VALUES (1, 1)",
    );
    database.exec(
      "INSERT INTO topics (id, slug, name) VALUES (101, 'annual-reading', 'Leitura na edição')",
    );
    database.exec(
      "INSERT INTO curriculum_topics (id, curriculum_id, topic_id, label) VALUES (102, 1, 101, 'Leitura na edição')",
    );
    database.exec(
      "INSERT INTO topics (id, slug, name) VALUES (102, 'related-reading', 'Leitura relacionada')",
    );
    database.exec(
      "INSERT INTO curriculum_topics (id, curriculum_id, topic_id, label) VALUES (103, 1, 102, 'Leitura relacionada')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_canonical_topics (curriculum_topic_id, canonical_topic_id, relation_type, source_document_id, review_status) VALUES (102, 1, 'primary', 1, 'published')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_stages (curriculum_topic_id, stage_id, source_document_id, review_status) VALUES (102, 1, 1, 'published')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_canonical_topics (curriculum_topic_id, canonical_topic_id, relation_type, source_document_id, review_status) VALUES (103, 1, 'related', 1, 'published')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_stages (curriculum_topic_id, stage_id, source_document_id, review_status) VALUES (103, 1, 1, 'published')",
    );
    database.exec(
      "INSERT INTO resources (id, title, url, provider, is_published, editorial_status, availability_mode, is_free) VALUES (2, 'Material ligado ao conceito global', 'https://example.invalid/canonical-resource', 'Fixture', 1, 'review', 'practice', 1)",
    );
    database.exec(
      "INSERT INTO resource_topics (resource_id, topic_id, review_status, relevance_status, accessibility_status) VALUES (2, 1, 'review', 'relevant', 'needs_improvement')",
    );
    database.exec("INSERT INTO resource_targets (resource_id, stage_id) VALUES (2, 1)");
    database.exec(
      "INSERT INTO resources (id, title, url, provider, is_published, editorial_status, availability_mode, is_free) VALUES (3, 'Material de outro tópico anual', 'https://example.invalid/related-resource', 'Fixture', 1, 'review', 'learning', 1)",
    );
    database.exec(
      "INSERT INTO resource_topics (resource_id, curriculum_topic_id, review_status, relevance_status, accessibility_status) VALUES (3, 103, 'review', 'relevant', 'unknown')",
    );
    database.exec("INSERT INTO resource_targets (resource_id, stage_id) VALUES (3, 1)");
    database.exec(
      "INSERT INTO resources (id, title, url, provider, is_published, editorial_status, availability_mode, is_free) VALUES (4, 'Vínculo explicitamente irrelevante', 'https://example.invalid/not-relevant', 'Fixture', 1, 'review', 'learning', 1)",
    );
    database.exec(
      "INSERT INTO resource_topics (resource_id, topic_id, review_status, relevance_status, accessibility_status) VALUES (4, 1, 'draft', 'not_relevant', 'unknown')",
    );
    database.exec("INSERT INTO resource_targets (resource_id, stage_id) VALUES (4, 1)");

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        return result
          ? result.values.map((values) => {
            return Object.fromEntries(
              result.columns.map((column, index) => {
                return [column, values[index]];
              }),
            );
          })
          : [];
      },
    };

    const topic = readContentTopic(contentDatabase, "annual-reading", {
      targetEditionSlug: "fixture-2026",
      targetStageSlug: "first",
    });

    expect(topic?.resources.map((resource) => { return resource.title; }))
      .toContain("Material ligado ao conceito global");
    expect(topic?.resources[0]?.editorialStatus).toBe("review");
    expect(topic?.resources.map((resource) => { return resource.title; }))
      .not.toContain("Material de outro tópico anual");
    expect(topic?.resources.map((resource) => { return resource.title; }))
      .not.toContain("Vínculo explicitamente irrelevante");
  });

  it("resolves the edition curriculum and resources from a canonical-topic page", () => {
    database.exec(
      "INSERT INTO canonical_topics (id, slug, name, status) VALUES (1, 'canonical-reading', 'Leitura', 'published')",
    );
    database.exec(
      "INSERT INTO topics (id, slug, name) VALUES (8, 'canonical-reading', 'Leitura')",
    );
    database.exec(
      "INSERT INTO canonical_topic_legacy_topics (canonical_topic_id, topic_id) VALUES (1, 8)",
    );
    database.exec(
      "INSERT INTO curriculum_topic_canonical_topics (curriculum_topic_id, canonical_topic_id, relation_type, source_document_id, review_status) VALUES (1, 1, 'primary', 1, 'published')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_stages (curriculum_topic_id, stage_id, source_document_id, source_page, source_excerpt, review_status) VALUES (1, 1, 1, 14, 'Programa oficial para leitura.', 'published')",
    );
    database.exec(
      "INSERT INTO resources (id, title, url, provider, is_published, editorial_status, availability_mode, is_free) VALUES (8, 'Material ligado ao conceito canônico', 'https://example.invalid/canonical-topic-resource', 'Fixture', 1, 'published', 'learning', 1)",
    );
    database.exec(
      "INSERT INTO resource_topics (resource_id, curriculum_topic_id, review_status, relevance_status, accessibility_status) VALUES (8, 1, 'published', 'relevant', 'checked')",
    );
    database.exec("INSERT INTO resource_targets (resource_id, stage_id) VALUES (8, 1)");

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        return result
          ? result.values.map((values) => {
            return Object.fromEntries(
              result.columns.map((column, index) => {
                return [column, values[index]];
              }),
            );
          })
          : [];
      },
    };

    const topic = readContentTopic(contentDatabase, "canonical-reading", {
      targetEditionSlug: "fixture-2026",
      targetStageSlug: "first",
    });

    expect(topic?.curriculum?.reviewStatus).toBe("published");
    expect(topic?.curriculum?.canonicalMappingStatus).toBe("published");
    expect(topic?.curriculum?.sourcePage).toBe(14);
    expect(topic?.resources.map((resource) => { return resource.title; }))
      .toContain("Material ligado ao conceito canônico");
  });

  it("reads complete exam-sized assessments and grades shuffled booklet labels canonically", () => {
    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        if (!result) {
          return [];
        }

        return result.values.map((values) => {
          return Object.fromEntries(
            result.columns.map((column, index) => {
              return [column, values[index]];
            }),
          );
        });
      },
    };

    const assessment = readContentAssessment(contentDatabase, "assessment:fixture-simulation-a");

    const shuffledQuestion = readContentQuestion(contentDatabase, "question:101");

    expect(assessment?.items)
      .toHaveLength(72);

    expect(assessment?.assessment.canSimulate)
      .toBe(true);

    expect(
      shuffledQuestion?.options.find((option) => {
        return option.canonicalCode === "A";
      }),
    )
      .toMatchObject({ code: "B", canonicalCode: "A" });

    expect(shuffledQuestion?.question.correct_answer)
      .toBe("A");

    expect(shuffledQuestion?.question.is_automatically_gradable)
      .toBe(true);

    expect(readContentQuestion(contentDatabase, "question:1")?.contexts)
      .toEqual([
        {
          id: 1,
          title: "Texto compartilhado sintético",
          content: "Contexto usado por três questões de teste.",
          position: 0,
          assets: [
            {
              id: 1,
              path: "test-assets/fixture-chart.svg",
              mediaType: "image/svg+xml",
              altText: "Gráfico sintético com duas séries.",
              position: 0,
            },
          ],
        },
      ]);

    expect(readContentQuestion(contentDatabase, "question:5")?.assets)
      .toEqual([
        {
          id: 1,
          path: "test-assets/fixture-chart.svg",
          mediaType: "image/svg+xml",
          altText: "Gráfico sintético com duas séries.",
          position: 0,
        },
      ]);
  });

  it("allows practice of answerable exam items and full simulation under an explicit annulment rule", () => {
    database.exec(`
      UPDATE assessment_sets
      SET kind = 'exam', stage_id = 1, paper_id = 1, paper_version_id = 1, expected_question_count = 72
      WHERE id = 1;
      INSERT INTO canonical_answer_keys
        (id, question_id, occurrence_id, version, status, answer_type, answer_value, is_automatically_gradable)
      VALUES (10001, 1, 1, 2, 'cancelled', 'single_choice', NULL, 0);
    `);

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        return result
          ? result.values.map((values) => Object.fromEntries(
            result.columns.map((column, index) => [column, values[index]]),
          ))
          : [];
      },
    };

    const cancelledQuestion = readContentQuestion(contentDatabase, "question:1");
    const withoutRule = readContentAssessment(contentDatabase, "assessment:fixture-simulation-a");

    expect(cancelledQuestion?.question).toMatchObject({
      answer_status: "cancelled",
      correct_answer: "",
      is_automatically_gradable: false,
    });
    expect(withoutRule?.assessment).toMatchObject({ canSimulate: false, canPractice: false });

    database.exec(
      "INSERT INTO scoring_rules (stage_id, paper_id, mode, metadata_json) VALUES (1, 1, 'official', '{\"cancelled_question_policy\":\"award_max_points\"}')",
    );

    const withRule = readContentAssessment(contentDatabase, "assessment:fixture-simulation-a");

    expect(withRule?.assessment).toMatchObject({
      canSimulate: true,
      canPractice: true,
      cancelledQuestionCount: 1,
      cancelledQuestionPolicy: "award_max_points",
    });
    expect(withRule?.assessment.practiceQuestionKeys).toHaveLength(71);
    expect(withRule?.assessment.practiceQuestionKeys).not.toContain("question:1");
  });

  it("blocks a cancelled item in simulation unless both its question and occurrence are editorially published", () => {
    database.exec(`
      UPDATE assessment_sets
      SET kind = 'exam', stage_id = 1, paper_id = 1, paper_version_id = 1, expected_question_count = 72
      WHERE id = 1;
      INSERT INTO canonical_answer_keys
        (id, question_id, occurrence_id, version, status, answer_type, answer_value, is_automatically_gradable)
      VALUES (10002, 1, 1, 2, 'cancelled', 'single_choice', NULL, 0);
      INSERT INTO scoring_rules (stage_id, paper_id, mode, metadata_json)
      VALUES (1, 1, 'official', '{\"cancelled_question_policy\":\"award_max_points\"}');
      UPDATE questions SET status = 'draft' WHERE id = 1;
    `);

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        return result
          ? result.values.map((values) => Object.fromEntries(
            result.columns.map((column, index) => [column, values[index]]),
          ))
          : [];
      },
    };

    expect(readContentAssessment(contentDatabase, "assessment:fixture-simulation-a")?.assessment.canSimulate)
      .toBe(false);

    database.exec("UPDATE questions SET status = 'published' WHERE id = 1; UPDATE question_occurrences SET status = 'review' WHERE id = 1;");

    expect(readContentAssessment(contentDatabase, "assessment:fixture-simulation-a")?.assessment.canSimulate)
      .toBe(false);

    database.exec("UPDATE question_occurrences SET status = 'published' WHERE id = 1;");

    expect(readContentAssessment(contentDatabase, "assessment:fixture-simulation-a")?.assessment.canSimulate)
      .toBe(true);
  });

  it("reuses historical questions only through a sourced target-phase curriculum mapping", () => {
    database.exec(
      "INSERT INTO canonical_topics (id, slug, name, status) VALUES (1, 'canonical-reading', 'Leitura', 'published')",
    );

    database.exec(
      "INSERT INTO canonical_topic_legacy_topics (canonical_topic_id, topic_id) VALUES (1, 1)",
    );

    database.exec(
      "INSERT INTO curriculum_topic_canonical_topics (curriculum_topic_id, canonical_topic_id, relation_type, source_document_id, review_status) VALUES (1, 1, 'primary', 1, 'published')",
    );

    database.exec(
      "INSERT INTO question_canonical_topics (question_id, canonical_topic_id, relation_type, source_document_id, review_status) VALUES (1, 1, 'primary', 1, 'published')",
    );

    database.exec(
      "INSERT INTO curriculum_topic_stages (curriculum_topic_id, stage_id, source_document_id, review_status) VALUES (1, 1, 1, 'published')",
    );

    database.exec(
      "INSERT INTO question_occurrences (id, question_id, paper_id, paper_version_id, subject_id, occurrence_key, number) VALUES (1000, 1, 2, 3, 1, 'fixture:old-edition:1', 1)",
    );

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        return result
          ? result.values.map((values) => {
            return Object.fromEntries(
              result.columns.map((column, index) => {
                return [column, values[index]];
              }),
            );
          })
          : [];
      },
    };

    const scope = {
      targetEditionSlug: "fixture-2026",
      targetStageSlug: "first",
      sourceEditionSlug: "fixture-2025",
    };

    database.exec(
      "UPDATE question_canonical_topics SET review_status = 'review' WHERE question_id = 1 AND canonical_topic_id = 1",
    );

    expect(readContentQuestion(contentDatabase, "question:1000", scope))
      .toBeNull();

    database.exec(
      "UPDATE question_canonical_topics SET review_status = 'published' WHERE question_id = 1 AND canonical_topic_id = 1",
    );

    expect(readContentQuestion(contentDatabase, "question:1000", scope)?.question.question_id)
      .toBe(
        1,
      );

    expect(
      readContentQuestion(contentDatabase, "question:1000", {
        ...scope,
        sourceEditionSlug: "fixture-2026",
      }),
    )
      .toBeNull();

    expect(
      readContentQuestion(contentDatabase, "question:1000", {
        ...scope,
        targetEditionSlug: "fixture-2025",
      }),
    )
      .toBeNull();

    database.exec(
      "INSERT INTO topics (id, slug, name) VALUES (101, 'annual-reading', 'Leitura no programa anual')",
    );
    database.exec(
      "INSERT INTO curriculum_topics (id, curriculum_id, topic_id, label) VALUES (102, 1, 101, 'Leitura no programa anual')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_canonical_topics (curriculum_topic_id, canonical_topic_id, relation_type, source_document_id, review_status) VALUES (102, 1, 'primary', 1, 'published')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_stages (curriculum_topic_id, stage_id, source_document_id, review_status) VALUES (102, 1, 1, 'published')",
    );

    const annualTopic = readContentTopic(contentDatabase, "annual-reading", scope);

    expect(annualTopic?.questions.map((question) => { return question.slug; }))
      .toContain("fixture-question-1");
  });

  it("deduplicates equivalent caderno questions in topic practice while keeping source occurrences", () => {
    database.exec(
      "INSERT INTO canonical_topics (id, slug, name, status) VALUES (1, 'canonical-reading', 'Leitura', 'published')",
    );
    database.exec(
      "INSERT INTO canonical_topic_legacy_topics (canonical_topic_id, topic_id) VALUES (1, 1)",
    );
    database.exec(
      "INSERT INTO curriculum_topic_canonical_topics (curriculum_topic_id, canonical_topic_id, relation_type, source_document_id, review_status) VALUES (1, 1, 'primary', 1, 'published')",
    );
    database.exec(
      "INSERT INTO curriculum_topic_stages (curriculum_topic_id, stage_id, source_document_id, review_status) VALUES (1, 1, 1, 'published')",
    );
    database.exec(
      "INSERT INTO question_canonical_topics (question_id, canonical_topic_id, relation_type, source_document_id, review_status) VALUES (1, 1, 'primary', 1, 'published'), (2, 1, 'primary', 1, 'published')",
    );
    database.exec(
      "INSERT INTO canonical_question_relations (question_id, related_question_id, relation_type) VALUES (1, 2, 'equivalent')",
    );

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        return result
          ? result.values.map((values) => {
            return Object.fromEntries(
              result.columns.map((column, index) => {
                return [column, values[index]];
              }),
            );
          })
          : [];
      },
    };

    const questions = readTopicQuestions(contentDatabase, 1, {
      targetEditionSlug: "fixture-2026",
      targetStageSlug: "first",
    });

    expect(questions).toHaveLength(1);
    expect(questions[0].slug).toBe("fixture-question-1");
    expect(
      database.exec(
        "SELECT COUNT(*) FROM question_occurrences WHERE question_id IN (1, 2)",
      )[0].values,
    )
      .toEqual([[4]]);
  });

  it("keeps an official exam unavailable until its source paper metadata and items match", () => {
    expect(() => {
      return database.exec(
        "INSERT INTO assessment_sets (id, slug, title, kind, edition_id, admission_process_id, is_published) VALUES (9, 'fixture-official-incomplete', 'Prova incompleta', 'exam', 1, 1, 1)",
      );
    })
      .toThrow(/official exam metadata/);

    database.exec(
      "INSERT INTO assessment_sets (id, slug, title, kind, edition_id, admission_process_id, stage_id, paper_id, paper_version_id, duration_minutes, expected_question_count, is_published) VALUES (9, 'fixture-official-complete', 'Prova oficial sintética', 'exam', 1, 1, 1, 1, 1, 300, 72, 1)",
    );

    database.exec(
      "INSERT INTO assessment_set_items (assessment_set_id, position, item_type, question_occurrence_id, points) SELECT 9, number, 'question', id, 1 FROM question_occurrences WHERE paper_version_id = 1 ORDER BY number",
    );

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        return result
          ? result.values.map((values) => {
            return Object.fromEntries(
              result.columns.map((column, index) => {
                return [column, values[index]];
              }),
            );
          })
          : [];
      },
    };

    expect(
      readContentAssessment(contentDatabase, "assessment:fixture-official-complete")?.assessment
        .canSimulate,
    )
      .toBe(true);
  });

  it("keeps draft questions consultable while excluding them from training and grading", async () => {
    database.exec(`
      UPDATE questions SET status = 'draft' WHERE id IN (1, 73);
      UPDATE question_occurrences SET status = 'review' WHERE id = 1;
      UPDATE question_occurrences SET status = 'draft' WHERE id = 2;
      UPDATE assessment_sets SET is_published = 0 WHERE id = 3;
    `);

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        return result
          ? result.values.map((values) => Object.fromEntries(
            result.columns.map((column, index) => [column, values[index]]),
          ))
          : [];
      },
    };
    const scope = { targetEditionSlug: "fixture-2026", targetStageSlug: "first" };

    const draftCanonical = readContentQuestion(contentDatabase, "exercise:fixture-independent");
    const draftOccurrence = readContentQuestion(contentDatabase, "question:1");
    const reviewOccurrence = readContentQuestion(contentDatabase, "question:2");

    expect(draftCanonical?.question.training_eligible).toBe(false);
    expect(draftOccurrence?.question.training_eligible).toBe(false);
    expect(reviewOccurrence?.question.training_eligible).toBe(false);
    expect(readContentQuestion(contentDatabase, "exercise:fixture-independent", scope)).toBeNull();
    expect(readContentQuestion(contentDatabase, "question:1", scope)).toBeNull();
    expect(readContentQuestion(contentDatabase, "question:2", scope)).toBeNull();

    const repository = new SqlJsContentRepository({ execute: async () => contentDatabase });
    const catalog = await repository.getCatalog({});
    const independentCard = catalog.content.find((card) => card.slug === "fixture-independent");
    const draftOccurrenceCard = catalog.content.find((card) => card.type === "question" && card.id === 1);

    expect(independentCard).toMatchObject({
      type: "question",
      href: "/exercicios/fixture-independent",
      availabilityMode: "consultation_only",
    });
    expect(draftOccurrenceCard).toMatchObject({ availabilityMode: "consultation_only" });
    expect((await repository.getCatalog({ trainingScope: scope })).content)
      .not.toContainEqual(expect.objectContaining({ href: "/exercicios/fixture-independent" }));

    const draftAssessment = readContentAssessment(contentDatabase, "assessment:fixture-independent-practice");
    const publishedAssessmentWithDraftItem = readContentAssessment(contentDatabase, "assessment:fixture-simulation-a");

    expect(draftAssessment?.assessment).toMatchObject({
      is_published: 0,
      canSimulate: false,
      canPractice: false,
    });
    expect(publishedAssessmentWithDraftItem?.assessment.canPractice).toBe(false);
  });

  it("surfaces published assessments through the filtered catalog", async () => {
    database.exec(
      "INSERT INTO content_assets (id, path, media_type, alt_text, source_document_id) VALUES (2, 'offline/test-paper.pdf', 'application/pdf', 'Caderno PDF', 1); UPDATE resources SET source_document_id = 1 WHERE id = 1",
    );

    const contentDatabase: ContentDatabase = {
      source: "fixture",
      get(sql, params) {
        return contentDatabase.query(sql, params)[0] || null;
      },
      query(sql, params) {
        const result = database.exec(sql, params)[0];

        if (!result) {
          return [];
        }

        return result.values.map((values) => {
          return Object.fromEntries(
            result.columns.map((column, index) => {
              return [column, values[index]];
            }),
          );
        });
      },
    };

    const repository = new SqlJsContentRepository({
      execute: async () => {
        return contentDatabase;
      },
    });

    const catalog = await repository.getCatalog({
      processName: "Seleção sintética",
      year: 2026,
    });

    expect(
      catalog.content.filter((item) => {
        return item.type === "assessment";
      }),
    )
      .toHaveLength(2);

    expect(
      catalog.content.find((item) => {
        return item.slug === "fixture-simulation-a";
      }),
    )
      .toMatchObject({
        processName: "Seleção sintética de teste",
        year: 2026,
        meta: "Seleção sintética de teste · 2026 · 72 questões · 300 min",
      });

    expect(catalog.content.find((item) => item.id === 1 && item.type === "resource")?.href)
      .toBe("/data/offline/test-paper.pdf");
    expect(catalog.content.find((item) => item.id === "source-document:1")?.href)
      .toBe("/data/offline/test-paper.pdf");
  });

  it("keeps legacy answer IDs and supports independently versioned occurrence and part answers", () => {
    database.exec(
      "INSERT INTO canonical_answer_keys (id, question_id, occurrence_id, question_part_id, version, status, answer_type, answer_value) VALUES (1001, 1, 101, NULL, 1, 'provisional', 'single_choice', 'C'), (1002, 1, 101, NULL, 2, 'definitive', 'single_choice', 'B'), (1003, 1, NULL, 1, 1, 'definitive', 'discursive', 'Critério sintético'), (1004, 1, 101, 1, 1, 'definitive', 'discursive', 'Critério do caderno');",
    );

    expect(
      database.exec("SELECT id, question_occurrence_id, answer_value FROM answer_keys")[0].values,
    )
      .toEqual([[1, 1, "A"]]);

    expect(
      database.exec(
        "SELECT id, status, answer_value FROM canonical_answer_keys WHERE occurrence_id = 101 AND question_part_id IS NULL ORDER BY CASE status WHEN 'definitive' THEN 0 WHEN 'cancelled' THEN 0 ELSE 1 END, version DESC LIMIT 1",
      )[0].values,
    )
      .toEqual([[1002, "definitive", "B"]]);

    database.exec(
      "INSERT INTO canonical_answer_keys (id, question_id, occurrence_id, version, status, answer_type) VALUES (1005, 1, 101, 3, 'cancelled', 'single_choice');",
    );

    expect(
      database.exec(
        "SELECT id, status, is_automatically_gradable FROM canonical_answer_keys WHERE occurrence_id = 101 AND question_part_id IS NULL ORDER BY CASE status WHEN 'definitive' THEN 0 WHEN 'cancelled' THEN 0 ELSE 1 END, version DESC LIMIT 1",
      )[0].values,
    )
      .toEqual([[1005, "cancelled", 0]]);
  });

  it.each([
    "INSERT INTO canonical_answer_keys (question_id, answer_type) VALUES (1, 'single_choice')",
    "INSERT INTO canonical_answer_keys (question_id, occurrence_id, answer_type) VALUES (1, 2, 'single_choice')",
    "INSERT INTO canonical_answer_keys (question_id, question_part_id, answer_type) VALUES (1, 2, 'discursive')",
    "INSERT INTO canonical_answer_keys (question_id, version, status, answer_type) VALUES (1, 2, 'unknown', 'single_choice')",
    "INSERT INTO canonical_answer_keys (question_id, version, answer_type) VALUES (1, 0, 'single_choice')",
    "INSERT INTO canonical_answer_keys (question_id, version, status, answer_type, is_automatically_gradable) VALUES (1, 2, 'cancelled', 'single_choice', 1)",
    "INSERT INTO canonical_answer_key_options (answer_key_id, question_option_id) VALUES (1, 20)",
    "UPDATE canonical_answer_keys SET question_id = 2 WHERE id = 1",
    "UPDATE canonical_answer_key_options SET question_option_id = 20 WHERE answer_key_id = 1",
  ])("rejects invalid canonical answer scope or version: %s", (statement) => {
    expect(() => {
      database.exec(statement);
    })
      .toThrow();
  });

  it("uniquely versions all four nullable answer scopes", () => {
    database.exec(
      "INSERT INTO canonical_answer_keys (question_id, occurrence_id, question_part_id, version, answer_type) VALUES (1, 1, NULL, 1, 'single_choice'), (1, NULL, 1, 1, 'discursive'), (1, 1, 1, 1, 'discursive');",
    );

    [
      "INSERT INTO canonical_answer_keys (question_id, occurrence_id, question_part_id, version, answer_type) VALUES (1, 1, NULL, 1, 'single_choice')",
      "INSERT INTO canonical_answer_keys (question_id, occurrence_id, question_part_id, version, answer_type) VALUES (1, NULL, 1, 1, 'discursive')",
      "INSERT INTO canonical_answer_keys (question_id, occurrence_id, question_part_id, version, answer_type) VALUES (1, 1, 1, 1, 'discursive')",
      "UPDATE canonical_answer_keys SET occurrence_id = NULL, question_part_id = NULL WHERE occurrence_id = 1 AND question_part_id IS NULL",
    ].forEach((statement) => {
      expect(() => {
        database.exec(statement);
      })
        .toThrow();
    });
  });

  it.each([
    "INSERT INTO question_occurrence_options (occurrence_id, question_option_id, code, position) VALUES (1, 20, 'E', 4)",
    "INSERT INTO question_occurrence_options (occurrence_id, question_option_id, code, position) VALUES (1, 10, 'E', 4)",
    "UPDATE question_occurrence_options SET code = 'B' WHERE occurrence_id = 1 AND question_option_id = 10",
    "UPDATE question_occurrence_options SET position = 1 WHERE occurrence_id = 1 AND question_option_id = 10",
    "UPDATE question_occurrence_options SET question_option_id = 20 WHERE occurrence_id = 1 AND question_option_id = 10",
    "UPDATE question_occurrences SET paper_version_id = 3 WHERE id = 1",
    "UPDATE paper_versions SET paper_id = 2 WHERE id = 1",
    "UPDATE question_occurrences SET question_id = 2 WHERE id = 1",
    "UPDATE question_options SET question_id = 2 WHERE id = 10",
    "INSERT INTO answer_keys (question_occurrence_id, question_part_id, answer_type) VALUES (1, 2, 'discursive')",
    "INSERT INTO answer_key_options (answer_key_id, question_option_id) VALUES (1, 20)",
    "UPDATE answer_keys SET question_occurrence_id = 2 WHERE id = 1",
  ])("rejects wrong owners and invalid option maps: %s", (statement) => {
    expect(() => {
      database.exec(statement);
    })
      .toThrow();
  });

  it("rejects changing a referenced part owner in canonical and legacy answers", () => {
    database.exec(
      "UPDATE answer_keys SET question_part_id = 1 WHERE id = 1; INSERT INTO canonical_answer_keys (question_id, question_part_id, answer_type) VALUES (1, 1, 'discursive');",
    );

    expect(() => {
      database.exec("UPDATE question_parts SET question_id = 2 WHERE id = 1");
    })
      .toThrow();
  });

  it.each([
    "INSERT INTO assessment_set_items (assessment_set_id, position) VALUES (3, 2)",
    "INSERT INTO assessment_set_items (assessment_set_id, position, question_id, question_occurrence_id) VALUES (3, 2, 73, 1)",
    "INSERT INTO assessment_set_items (assessment_set_id, position, item_type, lesson_id) VALUES (3, 2, 'question', 1)",
    "INSERT INTO assessment_set_items (assessment_set_id, position, item_type, question_id) VALUES (3, 2, 'lesson', 73)",
    "UPDATE assessment_set_items SET lesson_id = 1 WHERE assessment_set_id = 3",
    "UPDATE assessment_set_items SET question_id = NULL WHERE assessment_set_id = 3",
    "INSERT INTO learning_course_items (module_id, item_type, title) VALUES (1, 'practice', 'Inválido')",
    "INSERT INTO learning_course_items (module_id, item_type, title, lesson_id, question_id) VALUES (1, 'practice', 'Inválido', 1, 73)",
    "INSERT INTO learning_course_items (module_id, item_type, title, lesson_id) VALUES (1, 'assessment', 'Inválido', 1)",
    "INSERT INTO learning_course_items (module_id, item_type, title, question_id) VALUES (1, 'unknown', 'Inválido', 73)",
    "UPDATE learning_course_items SET assessment_set_id = 1 WHERE id = 2",
    "UPDATE learning_course_items SET item_type = 'lesson' WHERE id = 2",
  ])("enforces exactly one compatible assessment or learning target: %s", (statement) => {
    expect(() => {
      database.exec(statement);
    })
      .toThrow();
  });

  it("enforces foreign keys for standalone exercises and shared references", () => {
    [
      "INSERT INTO canonical_question_topics (question_id, topic_id) VALUES (999, 1)",
      "INSERT INTO canonical_question_topics (question_id, topic_id, confidence) VALUES (1, 2, 1.1)",
      "INSERT INTO question_stimuli (question_id, stimulus_id, position) VALUES (73, 999, 0)",
      "INSERT INTO stimulus_assets (stimulus_id, asset_id, position) VALUES (1, 999, 1)",
      "INSERT INTO question_assets (question_id, asset_id, position) VALUES (73, 999, 0)",
      "UPDATE assessment_set_items SET question_id = 999 WHERE assessment_set_id = 3",
      "UPDATE learning_course_items SET question_id = 999 WHERE id = 2",
      "DELETE FROM content_assets WHERE id = 1",
    ].forEach((statement) => {
      expect(() => {
        database.exec(statement);
      })
        .toThrow();
    });
  });

  it("closes SQLite nullable uniqueness holes without rewriting existing IDs", () => {
    database.exec(
      "INSERT INTO question_occurrences (id, question_id, paper_id, occurrence_key, number) VALUES (999, 73, 1, 'fixture:unversioned', 73); INSERT INTO lesson_topics (lesson_id, topic_id) VALUES (1, 1); INSERT INTO resource_topics (resource_id, curriculum_topic_id) VALUES (1, 1); INSERT INTO learning_course_targets (learning_course_id, edition_id) VALUES (1, 1);",
    );

    [
      "INSERT INTO question_occurrences (question_id, paper_id, occurrence_key, number) VALUES (73, 1, 'fixture:duplicate', 73)",
      "INSERT INTO course_offerings (edition_id, degree_program_id) VALUES (1, 1)",
      "INSERT INTO course_stage_requirements (course_offering_id, stage_id) VALUES (1, 1)",
      "INSERT INTO lesson_topics (lesson_id, topic_id) VALUES (1, 1)",
      "INSERT INTO resource_topics (resource_id, curriculum_topic_id) VALUES (1, 1)",
      "INSERT INTO learning_course_targets (learning_course_id, edition_id) VALUES (1, 1)",
    ].forEach((statement) => {
      expect(() => {
        database.exec(statement);
      })
        .toThrow(/UNIQUE/);
    });

    expect(
      database.exec("SELECT id, occurrence_key FROM question_occurrences WHERE id = 999")[0].values,
    )
      .toEqual([[999, "fixture:unversioned"]]);
  });

  it.each([
    "INSERT INTO lesson_topics (lesson_id) VALUES (1)",
    "INSERT INTO lesson_topics (lesson_id, topic_id, curriculum_topic_id) VALUES (1, 2, 1)",
    "INSERT INTO resource_topics (resource_id) VALUES (1)",
    "INSERT INTO resource_topics (resource_id, topic_id, curriculum_topic_id) VALUES (1, 2, 1)",
    "INSERT INTO learning_course_targets (learning_course_id) VALUES (1)",
    "INSERT INTO learning_course_targets (learning_course_id, admission_process_id, edition_id) VALUES (1, 2, 1)",
    "UPDATE curriculum_topics SET parent_id = 101 WHERE id = 1",
    "UPDATE curriculum_topics SET parent_id = 1 WHERE id = 1",
    "UPDATE question_topics SET curriculum_topic_id = 101 WHERE question_occurrence_id = 1",
    "UPDATE course_stage_requirements SET stage_id = 2 WHERE course_offering_id = 1",
    "UPDATE course_stage_requirements SET paper_id = 2 WHERE course_offering_id = 1",
    "UPDATE course_offerings SET edition_id = 2 WHERE id = 1",
    "UPDATE degree_programs SET university_id = 2 WHERE id = 1",
    "UPDATE campuses SET university_id = 2 WHERE id = 1",
    "UPDATE assessment_sets SET admission_process_id = 2 WHERE id = 1",
    "UPDATE editions SET admission_process_id = 2 WHERE id = 1",
    "UPDATE study_plan_steps SET module_id = 2 WHERE id = 1",
    "UPDATE learning_map_edges SET to_topic_id = 3 WHERE map_id = 1",
    "UPDATE learning_map_edges SET to_topic_id = 1 WHERE map_id = 1",
    "DELETE FROM learning_map_topics WHERE map_id = 1 AND curriculum_topic_id = 1",
    "UPDATE learning_map_topics SET curriculum_topic_id = 3 WHERE map_id = 1 AND curriculum_topic_id = 1",
    "INSERT INTO lesson_sources (lesson_id, source_document_id) VALUES (1, 999)",
  ])("rejects empty or cross-owner relationships: %s", (statement) => {
    expect(() => {
      database.exec(statement);
    })
      .toThrow();
  });

  it("protects paired topic owners and the legacy missing lesson-source foreign key", () => {
    database.exec(
      "INSERT INTO lesson_topics (lesson_id, topic_id, curriculum_topic_id) VALUES (1, 1, 1); INSERT INTO lesson_sources (lesson_id, source_document_id) VALUES (1, 1);",
    );

    expect(() => {
      database.exec("UPDATE curriculum_topics SET topic_id = 2 WHERE id = 1");
    })
      .toThrow();

    expect(() => {
      database.exec("UPDATE lesson_sources SET source_document_id = 999 WHERE lesson_id = 1");
    })
      .toThrow();

    expect(() => {
      database.exec("DELETE FROM source_documents WHERE id = 1");
    })
      .toThrow();
  });

  it("upgrades populated schema 4 and rolls back additively while preserving legacy content IDs", () => {
    const legacy = new engine.Database();

    legacy.exec("PRAGMA foreign_keys = ON");

    migrations
      .filter((migration) => {
        return migration.name < "20261005000000_editorial_integrity.sql";
      })
      .forEach((migration) => {
        legacy.exec(migration.up);
      });

    legacy.exec(
      "INSERT INTO questions (id, slug, type, statement) VALUES (411, 'legacy-preserved', 'single_choice', 'Fixture legada'); INSERT INTO lessons (id, slug, title) VALUES (811, 'legacy-lesson', 'Aula legada'); INSERT INTO assessment_sets (id, slug, title) VALUES (911, 'legacy-assessment', 'Lista legada'); INSERT INTO assessment_set_items (assessment_set_id, position, item_type, lesson_id) VALUES (911, 1, 'lesson', 811);",
    );

    const integrityMigration = migrations.find((migration) => {
      return migration.name === "20261005000000_editorial_integrity.sql";
    });

    expect(integrityMigration)
      .toBeDefined();

    legacy.exec(integrityMigration?.up || "");

    expect(legacy.exec("SELECT id, slug FROM questions")[0].values)
      .toEqual([
        [411, "legacy-preserved"],
      ]);

    expect(
      legacy.exec("SELECT assessment_set_id, lesson_id, question_id FROM assessment_set_items")[0]
        .values,
    )
      .toEqual([[911, 811, null]]);

    legacy.exec(integrityMigration?.down || "");

    expect(legacy.exec("SELECT id, slug FROM questions")[0].values)
      .toEqual([
        [411, "legacy-preserved"],
      ]);

    expect(
      legacy.exec("SELECT assessment_set_id, lesson_id FROM assessment_set_items")[0].values,
    )
      .toEqual([[911, 811]]);

    expect(
      legacy.exec("SELECT COUNT(*) FROM sqlite_master WHERE name = 'canonical_answer_keys'")[0]
        .values,
    )
      .toEqual([[0]]);

    expect(legacy.exec("PRAGMA foreign_key_check"))
      .toEqual([]);

    legacy.close();
  });

  it("adds editorial and availability metadata to resources without changing their visibility", () => {
    const migration = migrations.find((item) => {
      return item.name === "20261014000000_consultation_editorial_states.sql";
    });

    const database = new engine.Database();

    expect(migration)
      .toBeDefined();

    migrations
      .filter((item) => {
        return item.name <= (migration?.name || "");
      })
      .forEach((item) => {
        database.exec(item.up);
      });

    database.exec(
      "INSERT INTO resources (id, title, url, provider, is_published) VALUES (991, 'Caderno consultável', '/data/paper.pdf', 'Comvest', 1)",
    );

    expect(
      database.exec(
        "SELECT is_published, editorial_status, availability_mode FROM resources WHERE id = 991",
      )[0].values,
    )
      .toEqual([[1, "review", "reference"]]);

    database.exec(
      "UPDATE resources SET availability_mode = 'consultation_only', editorial_note = 'Em revisão; não usar como treino.' WHERE id = 991",
    );

    expect(
      database.exec(
        "SELECT is_published, editorial_status, availability_mode, editorial_note FROM resources WHERE id = 991",
      )[0].values,
    )
      .toEqual([[1, "review", "consultation_only", "Em revisão; não usar como treino."]]);

    database.close();
  });
});
