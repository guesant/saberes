import importlib.util
from pathlib import Path
import sqlite3
import unittest

SPEC = importlib.util.spec_from_file_location('release_local', Path(__file__).with_name('release_local.py'))
release = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(release)


class ReleaseTests(unittest.TestCase):
    def test_schema_is_read_from_database_not_hardcoded(self):
        with sqlite3.connect(':memory:') as db:
            db.execute('PRAGMA user_version=20')
            db.execute('CREATE TABLE content_releases(schema_version INTEGER)')
            db.execute('INSERT INTO content_releases VALUES (20)')
            self.assertEqual(release.schema_version(db), 20)

    def test_migrated_schema_can_be_released_after_previous_schema(self):
        with sqlite3.connect(':memory:') as db:
            db.execute('PRAGMA user_version=20')
            db.execute('CREATE TABLE content_releases(schema_version INTEGER)')
            db.execute('INSERT INTO content_releases VALUES (19)')
            self.assertEqual(release.schema_version(db), 20)

    def test_schema_older_than_recorded_release_is_rejected(self):
        with sqlite3.connect(':memory:') as db:
            db.execute('PRAGMA user_version=19')
            db.execute('CREATE TABLE content_releases(schema_version INTEGER)')
            db.execute('INSERT INTO content_releases VALUES (20)')
            with self.assertRaises(ValueError):
                release.schema_version(db)


if __name__ == '__main__':
    unittest.main()
