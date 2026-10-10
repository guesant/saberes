import sqlite3
import json
import tempfile
import unittest
from pathlib import Path

from tools.editorial.import_question_solutions import (
    SolutionImportError, apply_editorial_reviews, import_solutions,
)


class QuestionSolutionImportTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.addCleanup(self.db.close)
        self.db.executescript("""
            CREATE TABLE source_documents(id INTEGER PRIMARY KEY);
            CREATE TABLE questions(id INTEGER PRIMARY KEY);
            CREATE TABLE papers(id INTEGER PRIMARY KEY, stage_id INTEGER);
            CREATE TABLE paper_versions(id INTEGER PRIMARY KEY, code TEXT);
            CREATE TABLE stages(id INTEGER PRIMARY KEY, edition_id INTEGER);
            CREATE TABLE editions(id INTEGER PRIMARY KEY, year INTEGER, admission_process_id INTEGER);
            CREATE TABLE question_occurrences(id INTEGER PRIMARY KEY, question_id INTEGER, paper_id INTEGER,
                paper_version_id INTEGER, number INTEGER, source_document_id INTEGER, source_page INTEGER);
            CREATE TABLE canonical_answer_keys(id INTEGER PRIMARY KEY, question_id INTEGER, occurrence_id INTEGER,
                status TEXT, version INTEGER, answer_value TEXT, source_document_id INTEGER);
            CREATE TABLE question_solutions(id INTEGER PRIMARY KEY, question_id INTEGER, title TEXT, content TEXT,
                content_format TEXT, position INTEGER, source_document_id INTEGER, editorial_status TEXT,
                editorial_version TEXT, authorship TEXT, UNIQUE(question_id, position));
            INSERT INTO editions VALUES(1, 2027, 1);
            INSERT INTO stages VALUES(1, 1);
            INSERT INTO papers VALUES(1, 1);
            INSERT INTO paper_versions VALUES(1, 'QT');
            INSERT INTO questions VALUES(2737);
            INSERT INTO question_occurrences VALUES(2737,2737,1,1,1,335,3);
            INSERT INTO canonical_answer_keys VALUES(1,2737,2737,'definitive',1,'C',337);
        """)
        self.db.commit()

    def solution(self, **overrides):
        item = {
            "question_id": 2737,
            "occurrence_id": 2737,
            "number": 1,
            "title": "Resolução editorial",
            "content": "Raciocínio verificado contra o enunciado e o gabarito oficial.",
            "source_page": 3,
            "answer_value": "C",
            "source_document_ids": [335, 337],
            "review_status": "review",
            "authorship": "original_editorial",
        }
        item.update(overrides)
        return item

    def test_rejects_missing_editorial_migration(self):
        self.db.execute("ALTER TABLE question_solutions DROP COLUMN editorial_status")
        with self.assertRaises(SolutionImportError):
            import_solutions(self.db, [self.solution()], apply=False)

    def test_source_answer_and_course_occurrence_must_match(self):
        with self.assertRaises(SolutionImportError):
            import_solutions(self.db, [self.solution(answer_value="A")], apply=False)
        with self.assertRaises(SolutionImportError):
            import_solutions(self.db, [self.solution(source_page=4)], apply=False)

    def test_dry_run_and_explicit_review_promote_without_reinserting(self):
        items = [self.solution(number=n, question_id=4000+n, occurrence_id=4000+n,
                               title=f"Q{n}", content=f"Raciocínio editorial verificado {n}.",
                               source_page=3+n, answer_value="C") for n in range(1, 73)]
        self.db.executemany("INSERT INTO questions VALUES(?)", [(item["question_id"],) for item in items])
        self.db.executemany("INSERT INTO question_occurrences VALUES(?,?,?,?,?,?,?)", [
            (item["occurrence_id"], item["question_id"], 1, 1, item["number"], 335, item["source_page"])
            for item in items
        ])
        self.db.executemany("INSERT INTO canonical_answer_keys VALUES(?,?,?,?,?,?,?)", [
            (i+1, item["question_id"], item["occurrence_id"], "definitive", 1, "C", 337)
            for i, item in enumerate(items, start=1)
        ])
        self.db.commit()
        dry = import_solutions(self.db, items, apply=False)
        self.assertEqual(dry["would_insert"], 72)
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM question_solutions").fetchone()[0], 0)
        first = import_solutions(self.db, items, apply=True)
        approved = [dict(item, review_status="published") for item in items]
        second = import_solutions(self.db, approved, apply=True)
        third = import_solutions(self.db, approved, apply=True)
        self.assertEqual(len(first["inserted_questions"]), 72)
        self.assertEqual(len(second["promoted_questions"]), 72)
        self.assertEqual(third["already_present"], 72)
        self.assertEqual(third["promoted_questions"], [])
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM question_solutions WHERE editorial_status='published'").fetchone()[0], 72)

    def test_review_packages_apply_corrections_and_final_approval_without_deduplication(self):
        solutions = [self.solution(number=n, question_id=4000+n, occurrence_id=4000+n,
                                    title=f"Q{n}", content=f"Solução editorial {n}.",
                                    source_page=3+n, answer_value="C") for n in range(1, 73)]
        review_a = {"items": [
            {"number": n, "question_id": 4000+n, "occurrence_id": 4000+n,
             "answer": "C", "decision": "revise" if n == 4 else "publish"}
            for n in range(1, 37)
        ]}
        review_b = {"items": [
            {"number": n, "question_id": 4000+n, "occurrence_id": 4000+n,
             "answer": "C", "decision": "publish"}
            for n in range(37, 73)
        ]}
        correction = {"solutions": [{
            **solutions[3], "title": "Q4 corrigida", "content": "Solução corrigida após revisão independente.",
            "review_status": "review", "authorship": "original_editorial",
            "source_document_ids": [335, 337], "editorial_version": "1.0.1",
        }]}
        final_review = {"items": [{
            "number": 4, "question_id": 4004, "occurrence_id": 4004,
            "answer": "C", "decision": "publish",
        }]}

        with tempfile.TemporaryDirectory() as directory:
            paths = []
            for name, data in (("review-a.json", review_a), ("review-b.json", review_b),
                               ("correction.json", correction), ("final.json", final_review)):
                path = Path(directory) / name
                path.write_text(json.dumps(data), encoding="utf-8")
                paths.append(path)
            composed = apply_editorial_reviews(
                solutions, paths[:2], paths[2:3], paths[3:]
            )

        self.assertEqual(len(composed), 72)
        self.assertEqual(composed[3]["content"], "Solução corrigida após revisão independente.")
        self.assertEqual(composed[3]["editorial_version"], "1.0.1")
        self.assertEqual(composed[3]["review_status"], "published")
        self.assertEqual(composed[2]["review_status"], "published")

    def test_correction_cannot_change_key_or_publish_without_final_review(self):
        solutions = [self.solution(number=n, question_id=4000+n, occurrence_id=4000+n,
                                    title=f"Q{n}", content=f"Solução editorial {n}.",
                                    source_page=3+n, answer_value="C") for n in range(1, 73)]
        review = {"items": [
            {"number": n, "question_id": 4000+n, "occurrence_id": 4000+n,
             "answer": "C", "decision": "revise" if n == 4 else "publish"}
            for n in range(1, 73)
        ]}
        correction = {"solutions": [{
            **solutions[3], "title": "Q4 corrigida", "content": "Solução corrigida após revisão independente.",
            "answer_value": "A", "review_status": "review", "authorship": "original_editorial",
            "source_document_ids": [335, 337],
        }]}
        with tempfile.TemporaryDirectory() as directory:
            paths = []
            for name, data in (("review.json", review), ("correction.json", correction)):
                path = Path(directory) / name
                path.write_text(json.dumps(data), encoding="utf-8")
                paths.append(path)
            with self.assertRaises(SolutionImportError):
                apply_editorial_reviews(solutions, paths[:1], paths[1:])


if __name__ == "__main__":
    unittest.main()
