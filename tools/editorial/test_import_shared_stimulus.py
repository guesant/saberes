import sqlite3
import unittest

from tools.editorial.import_shared_stimulus import ImportErrorDetail, import_stimulus


PAYLOAD = {
    "version": 1,
    "stimulus": {
        "slug": "simulado-q57-q58-stimulus",
        "title": "Texto de apoio",
        "content": "Texto verificado.",
        "content_format": "plain_text",
        "source_document_id": 335,
        "source_page": 16,
    },
    "question_ids": [2793, 2794],
}


def database():
    conn = sqlite3.connect(":memory:")
    conn.executescript("""
        PRAGMA foreign_keys = ON;
        CREATE TABLE source_documents (id INTEGER PRIMARY KEY);
        CREATE TABLE questions (id INTEGER PRIMARY KEY);
        CREATE TABLE question_occurrences (
            question_id INTEGER, source_document_id INTEGER, source_page INTEGER
        );
        CREATE TABLE stimuli (
            id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT,
            content TEXT NOT NULL, content_format TEXT NOT NULL,
            source_document_id INTEGER, source_page INTEGER
        );
        CREATE TABLE question_stimuli (
            question_id INTEGER NOT NULL, stimulus_id INTEGER NOT NULL,
            position INTEGER NOT NULL, PRIMARY KEY (question_id, stimulus_id),
            FOREIGN KEY (question_id) REFERENCES questions(id),
            FOREIGN KEY (stimulus_id) REFERENCES stimuli(id)
        );
        INSERT INTO source_documents VALUES (335);
        INSERT INTO questions VALUES (2793), (2794);
        INSERT INTO question_occurrences VALUES (2793, 335, 17), (2794, 335, 17);
    """)
    return conn


class ImportSharedStimulusTests(unittest.TestCase):
    def test_dry_run_does_not_write(self):
        conn = database()
        self.addCleanup(conn.close)
        result = import_stimulus(conn, PAYLOAD, apply=False)
        self.assertEqual(result["links_to_add"], [2793, 2794])
        self.assertEqual(conn.execute("SELECT COUNT(*) FROM stimuli").fetchone()[0], 0)

    def test_apply_and_repeat_are_idempotent(self):
        conn = database()
        self.addCleanup(conn.close)
        first = import_stimulus(conn, PAYLOAD, apply=True)
        second = import_stimulus(conn, PAYLOAD, apply=True)
        self.assertEqual(first["links_added"], [2793, 2794])
        self.assertEqual(second["links_added"], [])
        self.assertEqual(conn.execute("SELECT COUNT(*) FROM stimuli").fetchone()[0], 1)
        self.assertEqual(conn.execute("SELECT COUNT(*) FROM question_stimuli").fetchone()[0], 2)

    def test_wrong_source_page_is_rejected(self):
        conn = database()
        self.addCleanup(conn.close)
        payload = {**PAYLOAD, "stimulus": {**PAYLOAD["stimulus"], "source_page": 12}}
        with self.assertRaises(ImportErrorDetail):
            import_stimulus(conn, payload, apply=False)


if __name__ == "__main__":
    unittest.main()
