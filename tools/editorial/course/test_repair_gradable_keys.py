import importlib.util
from pathlib import Path
import sqlite3
import unittest

SPEC = importlib.util.spec_from_file_location("repair_gradable_keys", Path(__file__).with_name("repair_gradable_keys.py"))
repair = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(repair)


class RepairGradableTests(unittest.TestCase):
    def setUp(self):
        src = sqlite3.connect(f"file:{repair.ROOT / '.local/content/content.sqlite'}?mode=ro", uri=True)
        self.db = sqlite3.connect(":memory:")
        src.backup(self.db)
        src.close()
        self.db.row_factory = sqlite3.Row
        # Recreate the known missing technical flag only in this disposable copy.
        self.db.execute("UPDATE canonical_answer_keys SET is_automatically_gradable=0 WHERE id=289")

    def tearDown(self):
        self.db.close()

    def test_cancelled_and_provisional_keys_are_excluded(self):
        self.assertIn(289, [row["id"] for row in repair.candidates(self.db)])
        self.db.execute("UPDATE canonical_answer_keys SET status='cancelled' WHERE id=289")
        self.assertNotIn(289, [row["id"] for row in repair.candidates(self.db)])

    def test_unpublished_or_inconsistent_keys_are_excluded(self):
        self.db.execute("UPDATE canonical_answer_keys SET answer_value='Z' WHERE id=289")
        self.assertNotIn(289, [row["id"] for row in repair.candidates(self.db)])
        self.db.execute("UPDATE canonical_answer_keys SET answer_value='C' WHERE id=289")
        self.db.execute("UPDATE questions SET status='review' WHERE id=289")
        self.assertNotIn(289, [row["id"] for row in repair.candidates(self.db)])

    def test_repair_is_idempotent_without_answer_changes(self):
        items = repair.candidates(self.db)
        before = [tuple(row) for row in self.db.execute("SELECT id,answer_value,status,version FROM canonical_answer_keys ORDER BY id")]
        self.db.executemany("UPDATE canonical_answer_keys SET is_automatically_gradable=1 WHERE id=?", [(item["id"],) for item in items])
        self.assertEqual(repair.candidates(self.db), [])
        self.assertEqual(before, [tuple(row) for row in self.db.execute("SELECT id,answer_value,status,version FROM canonical_answer_keys ORDER BY id")])


if __name__ == "__main__":
    unittest.main()
