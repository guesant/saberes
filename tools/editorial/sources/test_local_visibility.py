import sqlite3
import tempfile
import unittest
from contextlib import closing
from pathlib import Path

from local_visibility import CONFIRMATION, SAFE_VISIBILITY_TABLES, apply_visibility, audit_database


def make_database(path: Path) -> None:
    with closing(sqlite3.connect(path)) as connection:
        connection.execute("BEGIN")
        connection.executescript(
            """
            CREATE TABLE resources (id INTEGER PRIMARY KEY, is_published INTEGER NOT NULL, editorial_status TEXT NOT NULL);
            CREATE TABLE lessons (id INTEGER PRIMARY KEY, is_published INTEGER NOT NULL, review_status TEXT NOT NULL);
            CREATE TABLE learning_courses (id INTEGER PRIMARY KEY, is_published INTEGER NOT NULL);
            CREATE TABLE learning_maps (id INTEGER PRIMARY KEY, is_published INTEGER NOT NULL);
            CREATE TABLE study_plans (id INTEGER PRIMARY KEY, is_published INTEGER NOT NULL);
            CREATE TABLE source_documents (id INTEGER PRIMARY KEY, reuse_status TEXT NOT NULL);
            CREATE TABLE questions (id INTEGER PRIMARY KEY, status TEXT NOT NULL);
            CREATE TABLE question_occurrences (id INTEGER PRIMARY KEY, status TEXT NOT NULL);
            CREATE TABLE assessment_sets (id INTEGER PRIMARY KEY, is_published INTEGER NOT NULL);
            INSERT INTO resources VALUES (1, 0, 'review'), (2, 1, 'published');
            INSERT INTO lessons VALUES (1, 0, 'review');
            INSERT INTO learning_courses VALUES (1, 0);
            INSERT INTO learning_maps VALUES (1, 0);
            INSERT INTO study_plans VALUES (1, 0);
            INSERT INTO source_documents VALUES (1, 'unknown');
            INSERT INTO questions VALUES (1, 'draft');
            INSERT INTO question_occurrences VALUES (1, 'draft');
            INSERT INTO assessment_sets VALUES (1, 0);
            """
        )
        connection.commit()


class LocalVisibilityTests(unittest.TestCase):
    def test_audit_is_read_only_and_includes_full_hidden_keys(self):
        with tempfile.TemporaryDirectory() as directory:
            database = Path(directory) / "fixture.sqlite"
            make_database(database)

            report = audit_database(database)

            self.assertEqual(report["database_mode"], "read-only")
            self.assertEqual(report["target_tables"]["resources"]["is_published_hidden_ids"], [1])
            self.assertEqual(report["target_tables"]["questions"]["not_published_status_ids"], [1])
            self.assertEqual(report["target_tables"]["source_documents"]["unknown_reuse_ids"], [1])
            self.assertEqual(report["dry_run_plan"]["changes"][0]["table"], "resources")
            self.assertEqual(report["dry_run_plan"]["changes"][0]["ids"], [1])
            with closing(sqlite3.connect(database)) as connection:
                self.assertEqual(connection.execute("SELECT is_published FROM resources WHERE id=1").fetchone()[0], 0)
                self.assertEqual(connection.execute("SELECT status FROM questions WHERE id=1").fetchone()[0], "draft")

    def test_apply_changes_only_visibility_allowlist_and_keeps_backup(self):
        with tempfile.TemporaryDirectory() as directory:
            database = Path(directory) / "fixture.sqlite"
            backup = Path(directory) / "backup.sqlite"
            make_database(database)

            result = apply_visibility(database, backup, CONFIRMATION)

            self.assertEqual(result["deletions"], 0)
            self.assertEqual([change["table"] for change in result["changes"]], ["resources", "lessons", "learning_maps", "study_plans"])
            self.assertEqual(SAFE_VISIBILITY_TABLES, ("resources", "lessons", "learning_maps", "study_plans"))
            with closing(sqlite3.connect(database)) as connection:
                self.assertEqual(connection.execute("SELECT is_published FROM resources WHERE id=1").fetchone()[0], 1)
                self.assertEqual(connection.execute("SELECT is_published FROM learning_courses WHERE id=1").fetchone()[0], 0)
                self.assertEqual(connection.execute("SELECT is_published FROM assessment_sets WHERE id=1").fetchone()[0], 0)
                self.assertEqual(connection.execute("SELECT editorial_status FROM resources WHERE id=1").fetchone()[0], "review")
                self.assertEqual(connection.execute("SELECT status FROM questions WHERE id=1").fetchone()[0], "draft")
            with closing(sqlite3.connect(backup)) as connection:
                self.assertEqual(connection.execute("PRAGMA integrity_check").fetchone()[0], "ok")
                self.assertEqual(connection.execute("SELECT is_published FROM resources WHERE id=1").fetchone()[0], 0)

    def test_failed_update_rolls_back_every_visibility_change(self):
        with tempfile.TemporaryDirectory() as directory:
            database = Path(directory) / "fixture.sqlite"
            backup = Path(directory) / "backup.sqlite"
            make_database(database)
            with closing(sqlite3.connect(database)) as connection:
                connection.execute(
                    "CREATE TRIGGER reject_lesson_visibility BEFORE UPDATE OF is_published ON lessons "
                    "BEGIN SELECT RAISE(ABORT, 'fixture rollback'); END"
                )

            with self.assertRaises(sqlite3.IntegrityError):
                apply_visibility(database, backup, CONFIRMATION)
            with closing(sqlite3.connect(database)) as connection:
                self.assertEqual(connection.execute("SELECT is_published FROM resources WHERE id=1").fetchone()[0], 0)
            with closing(sqlite3.connect(backup)) as connection:
                self.assertEqual(connection.execute("PRAGMA integrity_check").fetchone()[0], "ok")

    def test_apply_requires_confirmation_and_nonoverwriting_backup(self):
        with tempfile.TemporaryDirectory() as directory:
            database = Path(directory) / "fixture.sqlite"
            backup = Path(directory) / "backup.sqlite"
            make_database(database)
            with self.assertRaises(PermissionError):
                apply_visibility(database, backup, "")
            backup.write_bytes(b"preserve existing backup")
            with self.assertRaises(FileExistsError):
                apply_visibility(database, backup, CONFIRMATION)
            self.assertEqual(backup.read_bytes(), b"preserve existing backup")


if __name__ == "__main__":
    unittest.main()
