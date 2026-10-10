import importlib.util
from pathlib import Path
import sqlite3
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('inventory', Path(__file__).with_name('review_inventory.py'))
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)


class InventoryTests(unittest.TestCase):
    def test_includes_all_pending_states_and_assessments_without_mutation(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'content.sqlite'
            with sqlite3.connect(path) as db:
                db.execute('CREATE TABLE questions(id INTEGER PRIMARY KEY, status TEXT, slug TEXT)')
                db.executemany('INSERT INTO questions VALUES(?,?,?)', [(1, 'draft', 'draft'), (2, 'published', 'published')])
                db.execute('CREATE TABLE canonical_answer_keys(id INTEGER PRIMARY KEY, status TEXT)')
                db.execute("INSERT INTO canonical_answer_keys VALUES(3,'provisional')")
                db.execute('CREATE TABLE assessment_sets(id INTEGER PRIMARY KEY, is_published INTEGER)')
                db.execute('INSERT INTO assessment_sets VALUES(4,0)')
            before = path.read_bytes()
            report = module.inventory(path)
            self.assertEqual(path.read_bytes(), before)
            self.assertEqual(len(report['records']), 3)
            self.assertEqual(report['totals']['questions.status'], 1)
            self.assertEqual(report['records'][0]['key'], {'id': 4})


if __name__ == '__main__':
    unittest.main()
