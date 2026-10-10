import sqlite3
import unittest
from pathlib import Path

from source_review import build_queue, validate_adjudications


def fixture() -> sqlite3.Connection:
    db = sqlite3.connect(":memory:")
    db.row_factory = sqlite3.Row
    db.executescript(
        """
        CREATE TABLE admission_processes(id INTEGER PRIMARY KEY, slug TEXT);
        CREATE TABLE editions(id INTEGER PRIMARY KEY, admission_process_id INTEGER, year INTEGER);
        CREATE TABLE stages(id INTEGER PRIMARY KEY, edition_id INTEGER, slug TEXT, name TEXT, kind TEXT);
        CREATE TABLE source_documents(id INTEGER PRIMARY KEY, title TEXT, url TEXT, checksum TEXT);
        CREATE TABLE resources(
          id INTEGER PRIMARY KEY, title TEXT, url TEXT, provider TEXT, kind TEXT,
          description TEXT, is_free INTEGER, is_published INTEGER, source_document_id INTEGER,
          editorial_status TEXT, editorial_note TEXT, availability_mode TEXT
        );
        CREATE TABLE resource_targets(resource_id INTEGER, stage_id INTEGER);
        CREATE TABLE resource_topics(
          resource_id INTEGER, topic_id INTEGER, curriculum_topic_id INTEGER,
          review_status TEXT, relevance_status TEXT, accessibility_status TEXT,
          review_note TEXT, source_document_id INTEGER, source_page INTEGER, source_excerpt TEXT
        );
        CREATE TABLE curricula(id INTEGER PRIMARY KEY, edition_id INTEGER, name TEXT);
        CREATE TABLE curriculum_topics(id INTEGER PRIMARY KEY, curriculum_id INTEGER, label TEXT);
        CREATE TABLE canonical_topics(id INTEGER PRIMARY KEY, slug TEXT);
        CREATE TABLE questions(id INTEGER PRIMARY KEY, slug TEXT);
        CREATE TABLE papers(id INTEGER PRIMARY KEY, stage_id INTEGER);
        CREATE TABLE question_occurrences(
          id INTEGER PRIMARY KEY, question_id INTEGER, paper_id INTEGER,
          source_document_id INTEGER, source_page INTEGER
        );
        CREATE TABLE question_topics(question_occurrence_id INTEGER, curriculum_topic_id INTEGER);
        CREATE TABLE canonical_question_topics(question_id INTEGER, topic_id INTEGER);
        CREATE TABLE question_canonical_topics(
          question_id INTEGER, canonical_topic_id INTEGER, relation_type TEXT,
          confidence REAL, source_document_id INTEGER, source_page INTEGER,
          source_excerpt TEXT, review_status TEXT
        );
        CREATE TABLE curriculum_topic_canonical_topics(
          curriculum_topic_id INTEGER, canonical_topic_id INTEGER, relation_type TEXT,
          confidence REAL, source_document_id INTEGER, source_page INTEGER,
          source_excerpt TEXT, review_status TEXT
        );
        CREATE TABLE curriculum_topic_stages(
          curriculum_topic_id INTEGER, stage_id INTEGER, is_required INTEGER,
          source_document_id INTEGER, source_page INTEGER, source_excerpt TEXT,
          review_status TEXT
        );
        CREATE TABLE edition_regulatory_rules(
          id INTEGER PRIMARY KEY, edition_id INTEGER, stage_id INTEGER, rule_key TEXT,
          rule_type TEXT, statement TEXT, effective_status TEXT, editorial_status TEXT,
          reviewed_at TEXT, notes TEXT
        );
        CREATE TABLE edition_regulatory_rule_sources(
          rule_id INTEGER, source_document_id INTEGER, source_location TEXT, source_order INTEGER
        );
        INSERT INTO admission_processes VALUES (1,'vestibular-unicamp');
        INSERT INTO editions VALUES (11,1,2027);
        INSERT INTO stages VALUES (11,11,'primeira-fase','1ª fase','objective');
        INSERT INTO source_documents VALUES
          (7,'Programa 2027','https://example.test/program.pdf','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        INSERT INTO resources VALUES
          (523,'Exercícios de trigonometria','https://example.test/523','Example','exercise','Practice',1,1,7,'review','Keep in review: Q11 has no correct answer.','practice'),
          (182,'Published resource','https://example.test/182','Example','exercise','Approved',1,1,7,'published','', 'practice'),
          (183,'Published with accessibility issue','https://example.test/183','Example','exercise','Approved',1,1,7,'published','', 'practice');
        INSERT INTO resource_targets VALUES (523,11),(182,11),(183,11);
        INSERT INTO curricula VALUES (10,11,'Programa 2027');
        INSERT INTO curriculum_topics VALUES (2482,10,'Trigonometria');
        INSERT INTO canonical_topics VALUES (99,'trigonometria');
        INSERT INTO questions VALUES (300,'vu-2027-q01');
        INSERT INTO papers VALUES (1,11);
        INSERT INTO question_occurrences VALUES (1,300,1,7,4);
        INSERT INTO question_canonical_topics VALUES
          (300,99,'primary',0.8,7,2,'Programa oficial: funções','review');
        INSERT INTO resource_topics VALUES
          (523,99,2482,'review','relevant','needs_improvement','Formula images lack equivalent text.',7,12,'Q11 and formulas'),
          (182,99,2482,'published','relevant','checked','',7,12,'Published mapping'),
          (183,99,2482,'published','relevant','needs_improvement','Needs improvement.',7,12,'Published with accessibility problem');
        INSERT INTO curriculum_topic_canonical_topics VALUES
          (2482,99,'primary',0.9,7,12,'Programa oficial: trigonometria','review');
        INSERT INTO curriculum_topic_stages VALUES
          (2482,11,1,7,12,'Programa oficial: trigonometria','published');
        INSERT INTO edition_regulatory_rules VALUES
          (1,11,11,'exam-format','format','Objetiva','vigente','review',NULL,'Recheck official notice.');
        INSERT INTO edition_regulatory_rule_sources VALUES
          (1,7,'p. 4',1);
        """
    )
    return db


class SourceReviewTests(unittest.TestCase):
    def test_builds_bounded_queue_with_hashes_and_skips_published_rows(self) -> None:
        db = fixture()
        baseline = db.total_changes
        manifest, records = build_queue(db, evidence_root=Path("/definitely-not-present"), stage_id=11)
        by_id = {record["candidate_id"]: record for record in records}

        self.assertIn("resource:523", by_id)
        self.assertIn("resource_topic:523:99:2482", by_id)
        self.assertIn("resource_topic:183:99:2482", by_id)
        self.assertIn("curriculum_topic_canonical:2482:99", by_id)
        self.assertIn("question_canonical_topic:300:99", by_id)
        self.assertIn("edition_regulatory_rule:1", by_id)
        self.assertNotIn("resource:182", by_id)
        self.assertNotIn("curriculum_topic_stage:2482:11", by_id)
        self.assertNotIn("resource:183", by_id)
        self.assertEqual(manifest["counts"]["published_resources_skipped_without_documented_problem"], 2)
        self.assertEqual(manifest["counts"]["published_resource_topic_classifications_skipped_without_problem"], 1)
        self.assertEqual(manifest["counts"]["published_curriculum_topic_stage_classifications_skipped"], 1)
        self.assertFalse(manifest["policy"]["http_200_is_approval"])
        self.assertEqual(len(by_id["resource:523"]["current_state_hash"]), 64)
        self.assertEqual(by_id["resource:523"]["source_evidence"][0]["content_sha256"], "a" * 64)
        self.assertEqual(db.total_changes, baseline)

    def test_requires_explicit_decision_reviewer_evidence_and_current_state(self) -> None:
        db = fixture()
        _, queue = build_queue(db, evidence_root=Path("/definitely-not-present"), stage_id=11)
        candidate = next(row for row in queue if row["candidate_id"] == "resource:523")
        adjudication = {
            "candidate_id": candidate["candidate_id"],
            "entity_type": candidate["entity_type"],
            "entity_id": candidate["entity_id"],
            "decision": "approve",
            "reviewer": "editor@example.test",
            "reviewed_at": "2026-10-09T13:00:00Z",
            "expected_current_state_hash": candidate["current_state_hash"],
            "rationale": "The cited defect was corrected and the page was rechecked.",
            "evidence": [{"uri": "https://example.test/recheck", "sha256": "b" * 64, "finding": "Q11 now has a valid key."}],
        }
        result = validate_adjudications([adjudication], queue, queue)
        self.assertTrue(result["valid"])
        self.assertEqual(result["database_writes"], 0)

        no_decision = dict(adjudication)
        del no_decision["decision"]
        self.assertFalse(validate_adjudications([no_decision], queue, queue)["valid"])

        http_200_only = dict(adjudication)
        http_200_only["http_status"] = 200
        rejected = validate_adjudications([http_200_only], queue, queue)
        self.assertFalse(rejected["valid"])
        self.assertTrue(any(issue["error"] == "unknown_fields" for issue in rejected["issues"]))

    def test_stale_database_state_invalidates_adjudication(self) -> None:
        db = fixture()
        _, old_queue = build_queue(db, evidence_root=Path("/definitely-not-present"), stage_id=11)
        candidate = next(row for row in old_queue if row["candidate_id"] == "resource:523")
        db.execute("UPDATE resources SET editorial_note='The exception changed.' WHERE id=523")
        _, live_queue = build_queue(db, evidence_root=Path("/definitely-not-present"), stage_id=11)
        adjudication = {
            "candidate_id": candidate["candidate_id"],
            "entity_type": candidate["entity_type"],
            "entity_id": candidate["entity_id"],
            "decision": "defer",
            "reviewer": "editor@example.test",
            "reviewed_at": "2026-10-09T13:00:00Z",
            "expected_current_state_hash": candidate["current_state_hash"],
            "rationale": "Wait for updated source evidence.",
            "evidence": [{"uri": "sqlite://resources/523", "sha256": "c" * 64, "finding": "Current note reviewed."}],
        }
        result = validate_adjudications([adjudication], old_queue, live_queue)
        self.assertFalse(result["valid"])
        self.assertTrue(any(issue["error"] == "stale_candidate_state" for issue in result["issues"]))


if __name__ == "__main__":
    unittest.main()
