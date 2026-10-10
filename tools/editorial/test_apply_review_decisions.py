import importlib.util
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('review', Path(__file__).with_name('apply_review_decisions.py'))
review = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(review)


class ReviewTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.database = self.root / 'content.sqlite'
        with sqlite3.connect(self.database) as db:
            db.execute('CREATE TABLE resources(id INTEGER PRIMARY KEY, editorial_status TEXT, title TEXT)')
            db.execute("INSERT INTO resources VALUES(1,'review','Reviewed resource')")
        self.decision = {'table': 'resources', 'key': {'id': 1}, 'expected': {'editorial_status': 'review'},
                         'changes': {'editorial_status': 'published'}, 'reason': 'Actual pedagogical review',
                         'evidence': [{'locator': 'https://example.org/lesson', 'detail': 'Worked example checked'}]}

    def tearDown(self):
        self.temp.cleanup()

    def manifest(self, decisions=None):
        path = self.root / 'decisions.json'
        path.write_text(json.dumps({'decisions': decisions if decisions is not None else [self.decision]}))
        return path

    def test_dry_run_does_not_write(self):
        before = review.digest(self.database)
        journal = review.execute(self.database, [self.manifest()])
        self.assertFalse(journal['applied'])
        self.assertEqual(before, review.digest(self.database))

    def test_apply_preserves_id_and_backup_and_is_idempotent(self):
        manifest = self.manifest()
        journal = review.execute(self.database, [manifest], True, self.root / 'audit.json')
        self.assertTrue(journal['applied'])
        with sqlite3.connect(journal['backup']) as db:
            self.assertEqual(db.execute('SELECT * FROM resources').fetchone(), (1, 'review', 'Reviewed resource'))
        with sqlite3.connect(self.database) as db:
            self.assertEqual(db.execute('SELECT * FROM resources').fetchone(), (1, 'published', 'Reviewed resource'))
        replay = review.execute(self.database, [manifest])
        self.assertEqual(replay['decisions'][0]['action'], 'already_applied')

    def test_missing_evidence_blocks_all_updates(self):
        self.decision['evidence'] = []
        with self.assertRaises(ValueError):
            review.execute(self.database, [self.manifest()], True, self.root / 'audit.json')
        with sqlite3.connect(self.database) as db:
            self.assertEqual(db.execute('SELECT editorial_status FROM resources').fetchone()[0], 'review')

    def test_stale_state_is_rejected(self):
        self.decision['expected']['editorial_status'] = 'draft'
        with self.assertRaisesRegex(ValueError, 'Stale'):
            review.execute(self.database, [self.manifest()])

    def test_identity_changes_and_duplicate_decisions_are_rejected(self):
        self.decision['changes']['id'] = 2
        with self.assertRaises(ValueError):
            review.execute(self.database, [self.manifest()])
        self.decision['changes'].pop('id')
        with self.assertRaisesRegex(ValueError, 'duplicate'):
            review.execute(self.database, [self.manifest([self.decision, self.decision])])

    def test_new_classification_is_additive_and_replay_safe(self):
        with sqlite3.connect(self.database) as db:
            db.execute('CREATE TABLE question_canonical_topics(question_id INTEGER, canonical_topic_id INTEGER, review_status TEXT, PRIMARY KEY(question_id,canonical_topic_id))')
        decision = {**self.decision, 'table': 'question_canonical_topics',
                    'key': {'question_id': 1, 'canonical_topic_id': 2}, 'expected': {'exists': False},
                    'changes': {'question_id': 1, 'canonical_topic_id': 2, 'review_status': 'published'}}
        manifest = self.manifest([decision])
        result = review.execute(self.database, [manifest], True, self.root / 'insert-audit.json')
        self.assertEqual(result['decisions'][0]['action'], 'insert')
        self.assertEqual(review.execute(self.database, [manifest])['decisions'][0]['action'], 'already_applied')

    def test_non_classification_insert_is_forbidden(self):
        self.decision['expected'] = {'exists': False}
        self.decision['changes']['id'] = 1
        with self.assertRaises(ValueError):
            review.execute(self.database, [self.manifest()])

    def test_scoring_rule_insert_requires_explicit_verified_cancelled_item_policy(self):
        with sqlite3.connect(self.database) as db:
            db.execute('CREATE TABLE scoring_rules(id INTEGER PRIMARY KEY, stage_id INTEGER, paper_id INTEGER, mode TEXT NOT NULL, points_per_correct REAL DEFAULT 1, max_score REAL, metadata_json TEXT, tri_enabled INTEGER NOT NULL DEFAULT 0)')
        decision = {**self.decision, 'table': 'scoring_rules', 'key': {'id': 1},
                    'expected': {'exists': False},
                    'changes': {'id': 1, 'stage_id': 9, 'paper_id': 3, 'mode': 'official',
                                'points_per_correct': 1, 'max_score': 72,
                                'metadata_json': '{"cancelled_question_policy":"award_max_points"}', 'tri_enabled': 0}}
        result = review.execute(self.database, [self.manifest([decision])], True, self.root / 'scoring-audit.json')
        self.assertTrue(result['applied'])
        with sqlite3.connect(self.database) as db:
            self.assertEqual(db.execute('SELECT metadata_json FROM scoring_rules WHERE id=1').fetchone()[0],
                             '{"cancelled_question_policy":"award_max_points"}')

        decision['changes']['metadata_json'] = '{}'
        with self.assertRaisesRegex(ValueError, 'Scoring-rule'):
            review.execute(self.database, [self.manifest([decision])])

    def test_source_document_insert_requires_reuse_and_rights_metadata(self):
        with sqlite3.connect(self.database) as db:
            db.execute('''CREATE TABLE source_documents(
                id INTEGER PRIMARY KEY, title TEXT NOT NULL, url TEXT UNIQUE NOT NULL,
                provider TEXT, kind TEXT NOT NULL, is_official INTEGER NOT NULL,
                reuse_status TEXT NOT NULL, license_name TEXT, license_url TEXT,
                attribution TEXT, rights_note TEXT NOT NULL)''')
        decision = {**self.decision, 'table': 'source_documents', 'key': {'id': 2},
                    'expected': {'exists': False},
                    'changes': {
                        'id': 2, 'title': 'Aula aberta', 'url': 'https://example.org/aula',
                        'provider': 'Example', 'kind': 'web', 'is_official': 0,
                        'reuse_status': 'link_only', 'license_name': 'CC BY-NC-SA 4.0',
                        'license_url': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
                        'attribution': 'Example', 'rights_note': 'Link only; do not copy.'}}
        manifest = self.manifest([decision])
        result = review.execute(self.database, [manifest], True, self.root / 'source-audit.json')
        self.assertTrue(result['applied'])
        with sqlite3.connect(self.database) as db:
            self.assertEqual(db.execute('SELECT reuse_status,license_name FROM source_documents WHERE id=2').fetchone(),
                             ('link_only', 'CC BY-NC-SA 4.0'))

        decision['changes']['url'] = 'http://example.org/aula'
        with self.assertRaisesRegex(ValueError, 'Source-document'):
            review.execute(self.database, [self.manifest([decision])])

    def test_resource_insert_requires_source_rights_and_topic_link(self):
        with sqlite3.connect(self.database) as db:
            db.execute('DROP TABLE resources')
            db.executescript('''
                CREATE TABLE source_documents(
                    id INTEGER PRIMARY KEY, title TEXT NOT NULL, url TEXT UNIQUE NOT NULL,
                    provider TEXT, kind TEXT NOT NULL, is_official INTEGER NOT NULL,
                    reuse_status TEXT NOT NULL, license_name TEXT, license_url TEXT,
                    attribution TEXT, rights_note TEXT NOT NULL);
                CREATE TABLE resources(
                    id INTEGER PRIMARY KEY, title TEXT NOT NULL, url TEXT UNIQUE NOT NULL,
                    provider TEXT NOT NULL, kind TEXT NOT NULL, description TEXT,
                    is_free INTEGER NOT NULL, is_published INTEGER NOT NULL,
                    source_document_id INTEGER NOT NULL, editorial_status TEXT NOT NULL,
                    editorial_note TEXT NOT NULL, availability_mode TEXT NOT NULL,
                    FOREIGN KEY(source_document_id) REFERENCES source_documents(id));
                CREATE TABLE resource_topics(
                    resource_id INTEGER NOT NULL, topic_id INTEGER, curriculum_topic_id INTEGER,
                    review_status TEXT NOT NULL, relevance_status TEXT NOT NULL,
                    accessibility_status TEXT NOT NULL, review_note TEXT NOT NULL,
                    PRIMARY KEY(resource_id, topic_id, curriculum_topic_id),
                    CHECK(topic_id IS NOT NULL OR curriculum_topic_id IS NOT NULL),
                    FOREIGN KEY(resource_id) REFERENCES resources(id));
            ''')
        evidence = [{'locator': 'https://example.org/area', 'detail': 'Direct lesson and practice page inspected; link-only rights recorded.'}]
        source = {
            'table': 'source_documents', 'key': {'id': 2}, 'expected': {'exists': False},
            'changes': {'id': 2, 'title': 'Area and perimeter lesson', 'url': 'https://example.org/area',
                        'provider': 'Example', 'kind': 'web', 'is_official': 0, 'reuse_status': 'link_only',
                        'license_name': None, 'license_url': None, 'attribution': 'Example',
                        'rights_note': 'External content; link and metadata only; no copying.'},
            'reason': 'Direct source checked for topic relevance; reproduction rights are not assumed.',
            'evidence': evidence,
        }
        resource = {
            'table': 'resources', 'key': {'id': 2}, 'expected': {'exists': False},
            'changes': {'id': 2, 'title': 'Area and perimeter lesson', 'url': 'https://example.org/area',
                        'provider': 'Example', 'kind': 'exercise', 'description': 'Supplementary practice.',
                        'is_free': 1, 'is_published': 1, 'source_document_id': 2,
                        'editorial_status': 'published', 'editorial_note': 'Supplement only; external link.',
                        'availability_mode': 'practice'},
            'reason': 'The directly inspected page provides a focused free practice activity.',
            'evidence': evidence,
        }
        relation = {
            'table': 'resource_topics',
            'key': {'resource_id': 2, 'topic_id': None, 'curriculum_topic_id': 10},
            'expected': {'exists': False},
            'changes': {'resource_id': 2, 'topic_id': None, 'curriculum_topic_id': 10,
                        'review_status': 'published', 'relevance_status': 'relevant',
                        'accessibility_status': 'unknown', 'review_note': 'Supplementary; accessibility not audited.'},
            'reason': 'The content directly practices an assessed subskill in this curriculum topic.',
            'evidence': evidence,
        }
        manifest = self.manifest([source, resource, relation])
        result = review.execute(self.database, [manifest], True, self.root / 'resource-audit.json')
        self.assertTrue(result['applied'])
        with sqlite3.connect(self.database) as db:
            self.assertEqual(db.execute('SELECT reuse_status FROM source_documents WHERE id=2').fetchone()[0], 'link_only')
            self.assertEqual(db.execute('SELECT availability_mode FROM resources WHERE id=2').fetchone()[0], 'practice')
            self.assertEqual(db.execute('SELECT review_status FROM resource_topics WHERE resource_id=2').fetchone()[0], 'published')

    def test_resource_insert_rejects_missing_rights_source(self):
        with sqlite3.connect(self.database) as db:
            db.execute('DROP TABLE resources')
            db.executescript('''
                CREATE TABLE source_documents(
                    id INTEGER PRIMARY KEY, title TEXT NOT NULL, url TEXT UNIQUE NOT NULL,
                    provider TEXT, kind TEXT NOT NULL, is_official INTEGER NOT NULL,
                    reuse_status TEXT NOT NULL, license_name TEXT, license_url TEXT,
                    attribution TEXT, rights_note TEXT NOT NULL);
                CREATE TABLE resources(
                    id INTEGER PRIMARY KEY, title TEXT NOT NULL, url TEXT UNIQUE NOT NULL,
                    provider TEXT NOT NULL, kind TEXT NOT NULL, description TEXT,
                    is_free INTEGER NOT NULL, is_published INTEGER NOT NULL,
                    source_document_id INTEGER, editorial_status TEXT NOT NULL,
                    editorial_note TEXT NOT NULL, availability_mode TEXT NOT NULL,
                    FOREIGN KEY(source_document_id) REFERENCES source_documents(id));
            ''')
        decision = {**self.decision, 'table': 'resources', 'key': {'id': 2},
                    'expected': {'exists': False},
                    'changes': {'id': 2, 'title': 'Untracked resource', 'url': 'https://example.org/resource',
                                'provider': 'Example', 'kind': 'article', 'is_free': 1, 'is_published': 1,
                                'source_document_id': None, 'editorial_status': 'published',
                                'editorial_note': 'A topic-focused supplement.', 'availability_mode': 'learning'}}
        with self.assertRaisesRegex(ValueError, 'Resource insertion'):
            review.execute(self.database, [self.manifest([decision])])

    def test_resource_target_is_limited_to_unicamp_2027_first_phase(self):
        with sqlite3.connect(self.database) as db:
            db.executescript('''
                CREATE TABLE editions(id INTEGER PRIMARY KEY, slug TEXT NOT NULL);
                CREATE TABLE stages(id INTEGER PRIMARY KEY, edition_id INTEGER NOT NULL, slug TEXT NOT NULL);
                CREATE TABLE resource_targets(resource_id INTEGER NOT NULL, stage_id INTEGER NOT NULL,
                    PRIMARY KEY(resource_id,stage_id));
                INSERT INTO editions VALUES(1,'unicamp-2027');
                INSERT INTO stages VALUES(11,1,'primeira-fase');
                INSERT INTO stages VALUES(12,1,'segunda-fase');
            ''')
        evidence = [{'locator': 'https://example.org/lesson', 'detail': 'Direct source audited.'}]
        valid = {'table': 'resource_targets', 'key': {'resource_id': 1, 'stage_id': 11},
                 'expected': {'exists': False}, 'changes': {'resource_id': 1, 'stage_id': 11},
                 'reason': 'Scope the resource to its reviewed target phase.', 'evidence': evidence}
        result = review.execute(self.database, [self.manifest([valid])], True, self.root / 'target-audit.json')
        self.assertTrue(result['applied'])
        with sqlite3.connect(self.database) as db:
            self.assertEqual(db.execute('SELECT stage_id FROM resource_targets').fetchone()[0], 11)
        invalid = {**valid, 'key': {'resource_id': 1, 'stage_id': 12},
                   'changes': {'resource_id': 1, 'stage_id': 12}}
        with self.assertRaisesRegex(ValueError, 'first phase'):
            review.execute(self.database, [self.manifest([invalid])])

    def test_dry_run_exercises_real_sql_constraints(self):
        with sqlite3.connect(self.database) as db:
            db.execute('CREATE TABLE question_canonical_topics(question_id INTEGER, canonical_topic_id INTEGER, review_status TEXT, PRIMARY KEY(question_id,canonical_topic_id))')
            db.execute('CREATE UNIQUE INDEX one_per_question ON question_canonical_topics(question_id)')
            db.execute("INSERT INTO question_canonical_topics VALUES(1,2,'review')")
        decision = {**self.decision, 'table': 'question_canonical_topics',
                    'key': {'question_id': 1, 'canonical_topic_id': 3}, 'expected': {'exists': False},
                    'changes': {'question_id': 1, 'canonical_topic_id': 3, 'review_status': 'published'}}
        before = self.database.read_bytes()
        with self.assertRaises(sqlite3.IntegrityError):
            review.execute(self.database, [self.manifest([decision])])
        self.assertEqual(self.database.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()
