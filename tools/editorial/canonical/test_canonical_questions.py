import sqlite3
import unittest

from canonical_questions import build_plan, render_migration


def fixture() -> sqlite3.Connection:
    db = sqlite3.connect(":memory:")
    db.row_factory = sqlite3.Row
    db.executescript(
        """
        CREATE TABLE editions(id INTEGER PRIMARY KEY, year INTEGER);
        CREATE TABLE stages(id INTEGER PRIMARY KEY, edition_id INTEGER);
        CREATE TABLE papers(id INTEGER PRIMARY KEY, stage_id INTEGER);
        CREATE TABLE paper_versions(id INTEGER PRIMARY KEY, paper_id INTEGER, code TEXT);
        CREATE TABLE questions(
          id INTEGER PRIMARY KEY, slug TEXT UNIQUE, type TEXT, statement TEXT,
          explanation TEXT, difficulty TEXT, image_path TEXT, status TEXT
        );
        CREATE TABLE question_occurrences(
          id INTEGER PRIMARY KEY, question_id INTEGER, paper_id INTEGER,
          paper_version_id INTEGER
        );
        CREATE TABLE question_options(
          id INTEGER PRIMARY KEY, question_id INTEGER, code TEXT, text TEXT, position INTEGER
        );
        CREATE TABLE question_parts(
          id INTEGER PRIMARY KEY, question_id INTEGER, code TEXT, prompt TEXT
        );
        CREATE TABLE question_assets(question_id INTEGER, asset_id INTEGER, position INTEGER);
        CREATE TABLE question_stimuli(question_id INTEGER, stimulus_id INTEGER, position INTEGER);
        CREATE TABLE canonical_question_relations(
          question_id INTEGER, related_question_id INTEGER, relation_type TEXT
        );
        CREATE TABLE dependent_rows(question_id INTEGER REFERENCES questions(id));
        INSERT INTO editions VALUES (1, 2025);
        INSERT INTO stages VALUES (1, 1);
        INSERT INTO papers VALUES (1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1);
        INSERT INTO paper_versions VALUES
          (1, 1, 'QZ'), (2, 2, 'RW'), (3, 3, 'SX'), (4, 4, 'TY'),
          (5, 5, 'QZ'), (6, 6, 'RW');
        INSERT INTO questions VALUES
          (10, 'base', 'multiple_choice', 'Qual é a capital do Brasil?', NULL, 'easy', NULL, 'published'),
          (11, 'clone', 'multiple_choice', 'Qual é a capital do Brasil?', NULL, 'easy', NULL, 'published'),
          (20, 'math-a', 'multiple_choice', 'Calcule 2 + 2.', NULL, 'easy', NULL, 'published'),
          (21, 'math-b', 'multiple_choice', 'Calcule 2 + 2.', NULL, 'easy', NULL, 'published'),
          (30, 'image-a', 'multiple_choice', 'Observe a imagem.', NULL, 'easy', 'img.png', 'published'),
          (31, 'image-b', 'multiple_choice', 'Observe a imagem.', NULL, 'easy', 'img.png', 'published'),
          (40, 'options-a', 'multiple_choice', 'Escolha uma alternativa.', NULL, 'easy', NULL, 'published'),
          (41, 'options-b', 'multiple_choice', 'Escolha uma alternativa.', NULL, 'easy', NULL, 'published'),
          (50, 'part-a', 'discursive', 'Responda.', NULL, 'medium', NULL, 'published'),
          (51, 'part-b', 'discursive', 'Responda.', NULL, 'medium', NULL, 'published');
        INSERT INTO question_occurrences VALUES
          (100, 10, 1, 1), (101, 11, 2, 2),
          (200, 20, 1, 1), (201, 21, 2, 2),
          (300, 30, 1, 1), (301, 31, 2, 2),
          (400, 40, 1, 1), (401, 41, 2, 2),
          (500, 50, 1, 1), (501, 51, 2, 2);
        INSERT INTO question_options VALUES
          (1, 10, 'A', 'Brasília', 0), (2, 10, 'B', 'Rio de Janeiro', 1),
          (3, 11, 'A', 'Brasília', 0), (4, 11, 'B', 'Rio de Janeiro', 1),
          (5, 20, 'A', '4', 0), (6, 21, 'A', '4', 0),
          (7, 30, 'A', 'Sim', 0), (8, 31, 'A', 'Sim', 0),
          (9, 40, 'A', 'Um', 0), (10, 41, 'A', 'Dois', 0);
        INSERT INTO question_parts VALUES (1, 50, 'a', 'Parte a'), (2, 51, 'a', 'Parte a');
        INSERT INTO question_assets VALUES (30, 900, 0), (31, 900, 0);
        INSERT INTO canonical_question_relations VALUES
          (10, 11, 'equivalent'), (20, 21, 'equivalent'),
          (30, 31, 'equivalent'), (40, 41, 'equivalent'),
          (50, 51, 'equivalent');
        """
    )
    return db


class CanonicalQuestionPlanTests(unittest.TestCase):
    def test_only_exact_plain_clone_is_eligible_and_database_is_unmodified(self) -> None:
        db = fixture()
        initial_changes = db.total_changes
        candidates, report = build_plan(db)
        decisions = {candidate.alias_question_id: candidate for candidate in candidates}

        self.assertEqual(decisions[11].decision, "alias_and_archive")
        self.assertEqual(decisions[21].decision, "skip")
        self.assertIn("mathematical_notation_requires_review", decisions[21].reasons)
        self.assertEqual(decisions[31].decision, "skip")
        self.assertIn("legacy_image_path_requires_review", decisions[31].reasons)
        self.assertIn("question_assets_or_stimuli_require_review", decisions[31].reasons)
        self.assertEqual(decisions[41].decision, "skip")
        self.assertIn("option_mismatch", decisions[41].reasons)
        self.assertEqual(decisions[51].decision, "skip")
        self.assertIn("multipart_question_requires_review", decisions[51].reasons)
        self.assertEqual(report["counts"]["eligible_alias_rows"], 1)
        self.assertEqual(db.total_changes, initial_changes)

    def test_migration_proposal_keeps_legacy_rows_and_does_not_rewrite_dependents(self) -> None:
        db = fixture()
        candidates, _ = build_plan(db)
        sql = render_migration(candidates, db)

        self.assertIn("canonical_question_aliases", sql)
        self.assertIn("canonical_question_archive", sql)
        self.assertIn("UPDATE questions SET status='archived' WHERE id=11", sql)
        self.assertNotIn("DELETE FROM", sql.upper())
        self.assertNotIn("UPDATE question_occurrences", sql)
        self.assertNotIn("UPDATE question_options", sql)
        self.assertNotIn("UPDATE answer_keys", sql)

        db.commit()
        db.execute("PRAGMA foreign_keys=ON")
        db.executescript(sql)
        self.assertEqual(
            db.execute("SELECT canonical_question_id FROM canonical_question_aliases WHERE alias_question_id=11").fetchone()[0],
            10,
        )
        self.assertEqual(db.execute("SELECT status FROM questions WHERE id=11").fetchone()[0], "archived")
        self.assertIsNotNone(db.execute("SELECT 1 FROM questions WHERE id=11").fetchone())
        self.assertIsNotNone(db.execute("SELECT 1 FROM question_occurrences WHERE id=101 AND question_id=11").fetchone())
        self.assertEqual(
            [row[0] for row in db.execute("SELECT id FROM question_options WHERE question_id=11 ORDER BY id")],
            [3, 4],
        )
        self.assertIsNotNone(db.execute("SELECT 1 FROM canonical_question_archive WHERE question_id=11").fetchone())


if __name__ == "__main__":
    unittest.main()
