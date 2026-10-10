import importlib.util
import json
from pathlib import Path
import sqlite3
import unittest

SPEC = importlib.util.spec_from_file_location("import_study_path", Path(__file__).with_name("import_study_path.py"))
course = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(course)


class StudyPathTests(unittest.TestCase):
    def setUp(self):
        # An in-memory copy tests the real schema/triggers without modifying the
        # authoritative content or depending on any generated release files.
        source = sqlite3.connect(f"file:{course.ROOT / '.local/content/content.sqlite'}?mode=ro", uri=True)
        self.db = sqlite3.connect(":memory:")
        source.backup(self.db)
        source.close()
        self.db.row_factory = sqlite3.Row
        self.db.execute("PRAGMA foreign_keys=ON")
        self.payload = {"version": 1, "lessons": []}
        for topic in course.rows(self.db, "SELECT id,label FROM curriculum_topics WHERE curriculum_id=10"):
            self.payload["lessons"].append({
                "curriculum_topic_id": topic["id"], "title": topic["label"],
                "canonical_topic_ids": [], "source_document_ids": [148],
                "review_status": "review", "editorial_version": "1.0.0", "estimated_minutes": 12,
                "sections": [{"type": kind, "title": kind, "content": "Texto sintético de teste para verificar a importação, não conteúdo editorial."}
                             for kind in ("theory", "example", "summary")]})

    def tearDown(self):
        self.db.close()

    def test_report_paths_are_portable_for_repository_files(self):
        self.assertEqual(course.report_path(course.ROOT / "content/editorial/input.json"),
                         "content/editorial/input.json")
        external = Path("/tmp/editorial-input.json")
        self.assertEqual(course.report_path(external), str(external))

    def test_apply_is_idempotent_and_preserves_occurrences_and_answers(self):
        before = [tuple(row) for row in self.db.execute("SELECT * FROM question_occurrences ORDER BY id")]
        answers = [tuple(row) for row in self.db.execute("SELECT * FROM canonical_answer_keys ORDER BY id")]
        course.assemble(self.db, self.payload, apply=True)
        counts = [self.db.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
                  for table in ("lessons", "lesson_sections", "learning_course_modules", "learning_course_items")]
        course.assemble(self.db, self.payload, apply=True)
        self.assertEqual(counts, [self.db.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
                                 for table in ("lessons", "lesson_sections", "learning_course_modules", "learning_course_items")])
        self.assertEqual(before, [tuple(row) for row in self.db.execute("SELECT * FROM question_occurrences ORDER BY id")])
        self.assertEqual(answers, [tuple(row) for row in self.db.execute("SELECT * FROM canonical_answer_keys ORDER BY id")])
        self.assertEqual(self.db.execute("PRAGMA foreign_key_check").fetchall(), [])

    def test_review_lessons_are_not_promoted(self):
        course.assemble(self.db, self.payload, apply=True)
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM lessons WHERE slug LIKE 'unicamp-2027-%' AND review_status='published'").fetchone()[0], 0)

    def test_approved_lessons_do_not_keep_stale_review_labels(self):
        for lesson in self.payload["lessons"]:
            lesson["review_status"] = "published"
        course.assemble(self.db, self.payload, apply=True)
        description = self.db.execute("SELECT description FROM learning_courses WHERE slug=?", (course.SLUG,)).fetchone()[0]
        self.assertNotIn("em revisão", description)
        labels = self.db.execute("SELECT i.description,l.intro FROM learning_course_items i JOIN lessons l ON l.id=i.lesson_id WHERE l.slug LIKE 'unicamp-2027-%' AND l.review_status='published'").fetchall()
        self.assertTrue(labels)
        self.assertTrue(all("revisada" in row[0] and "em revisão" not in row[1] for row in labels))

    def test_mixed_course_does_not_claim_all_lessons_approved(self):
        self.payload["lessons"][0]["review_status"] = "published"
        course.assemble(self.db, self.payload, apply=True)
        description = self.db.execute("SELECT description FROM learning_courses WHERE slug=?", (course.SLUG,)).fetchone()[0]
        self.assertIn("Há aulas originais em revisão", description)

    def test_updated_lesson_keeps_id_and_records_editorial_version(self):
        lesson = self.payload["lessons"][0]
        course.assemble(self.db, self.payload, apply=True)
        before = [tuple(row) for row in self.db.execute("SELECT id,slug FROM lessons ORDER BY id")]
        lesson["editorial_version"] = "1.1.0"
        course.assemble(self.db, self.payload, apply=True)
        self.assertEqual(before, [tuple(row) for row in self.db.execute("SELECT id,slug FROM lessons ORDER BY id")])
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM lessons WHERE editorial_version='1.1.0'").fetchone()[0], 3)

    def test_versioned_revision_overrides_named_sections_without_mutating_base(self):
        base_text = self.payload["lessons"][0]["sections"][0]["content"]
        revisions = {"version": 1, "revisions": [{
            "curriculum_topic_id": self.payload["lessons"][0]["curriculum_topic_id"],
            "editorial_version": "1.1.0",
            "source_document_ids": [148],
            "sections": [{"type": "theory", "content": "Teoria revisada com evidência e explicação suficientemente longa para a validação editorial."}],
        }]}
        revised = course.apply_revisions(self.payload, revisions)
        self.assertEqual(self.payload["lessons"][0]["sections"][0]["content"], base_text)
        self.assertIn("revisada", revised["lessons"][0]["sections"][0]["content"])
        self.assertEqual(revised["lessons"][0]["editorial_version"], "1.1.0")

    def test_lesson_revision_rejects_duplicate_or_unknown_topic(self):
        revision = {"curriculum_topic_id": self.payload["lessons"][0]["curriculum_topic_id"],
                    "editorial_version": "1.1.0", "sections": []}
        with self.assertRaises(ValueError):
            course.apply_revisions(self.payload, {"version": 1, "revisions": [revision, revision]})
        with self.assertRaises(ValueError):
            course.apply_revisions(self.payload, {"version": 1, "revisions": [{
                "curriculum_topic_id": -1, "editorial_version": "1.1.0", "sections": []}]})

    def test_lesson_followup_requires_and_applies_matching_previous_version(self):
        topic_id = self.payload["lessons"][0]["curriculum_topic_id"]
        payload = course.apply_revisions(self.payload, {"version": 1, "revisions": [{
            "curriculum_topic_id": topic_id, "editorial_version": "1.1.0", "sections": []}],
            "followups": [{"curriculum_topic_id": topic_id, "supersedes_version": "1.1.0",
                           "editorial_version": "1.2.0", "sections": [{
                               "type": "theory", "append": "Complemento revisado, com justificativa e exemplo."}]}]})
        self.assertEqual(payload["lessons"][0]["editorial_version"], "1.2.0")
        self.assertIn("Complemento revisado", payload["lessons"][0]["sections"][0]["content"])
        with self.assertRaises(ValueError):
            course.apply_revisions(self.payload, {"version": 1, "revisions": [{
                "curriculum_topic_id": topic_id, "editorial_version": "1.1.0", "sections": []}],
                "followups": [{"curriculum_topic_id": topic_id, "supersedes_version": "1.0.0",
                               "editorial_version": "1.2.0", "sections": []}]})

    def test_audit_batch_can_publish_only_an_explicit_as_is_decision(self):
        topic_id = self.payload["lessons"][0]["curriculum_topic_id"]
        audited = course.apply_lesson_audits(self.payload, [{"schema": "lesson-audit-batch/v1", "decisions": [{
            "curriculum_topic_id": topic_id, "current_version": "1.0.0",
            "decision": "approve_as_is", "proposed_status": "published",
        }]}])
        self.assertEqual(audited["lessons"][0]["review_status"], "published")
        self.assertEqual(self.payload["lessons"][0]["review_status"], "review")

    def test_audit_batch_applies_complete_humanity_replacements_but_keeps_review(self):
        topic_id = self.payload["lessons"][0]["curriculum_topic_id"]
        audited = course.apply_lesson_audits(self.payload, [{"format": "lesson-audit-batch/v1", "items": [{
            "curriculum_topic_id": topic_id,
            "current": {"editorial_version": "1.0.0"},
            "latest_proposal": {"editorial_version": "1.0.0", "review_status": "review"},
            "decision": "revise", "replacement_sections": {
                "theory": "Uma teoria suficientemente longa para validar a substituição e manter estado editorial em revisão.",
                "example": "Um exemplo suficientemente longo para mostrar a aplicação e permitir conferência independente.",
                "summary": "Uma síntese suficientemente longa com autochecagem e resposta verificável para o estudante.",
            }, "evidence": [{"source_document_id": 148}],
        }]}])
        lesson = audited["lessons"][0]
        self.assertEqual(lesson["review_status"], "review")
        self.assertEqual(lesson["editorial_version"], "1.0.1")
        self.assertEqual({item["type"] for item in lesson["sections"]}, {"theory", "example", "summary"})
        self.assertEqual(lesson["source_document_ids"], [148])

    def test_independent_second_review_can_publish_or_hold_using_sqlite_version(self):
        topic_id = self.payload["lessons"][0]["curriculum_topic_id"]
        first = {"format": "lesson-audit-batch/v1", "decisions": [{
            "curriculum_topic_id": topic_id, "current_version": "1.0.0",
            "decision": "revise", "proposed_version": "1.1.0", "proposed_status": "review",
            "proposed_sections": [{"type": kind, "title": kind, "content": f"Seção revisada e suficientemente completa para o teste: {kind}."}
                                  for kind in ("theory", "example", "summary")],
        }]}
        publish = {
            "format": "lesson-independent-second-review/v1",
            "items": [{
                "curriculum_topic_id": topic_id,
                "reviewed_version": "1.1.0",
                "decision": "publish_candidate",
                "recommended_status": "published",
            }],
        }
        audited = course.apply_lesson_audits(self.payload, [first, publish])
        self.assertEqual(audited["lessons"][0]["review_status"], "published")
        self.assertEqual(audited["lessons"][0]["editorial_version"], "1.1.0")

        hold = {
            "format": "lesson-independent-second-review/v1",
            "items": [{
                "curriculum_topic_id": topic_id,
                "reviewed_version": "1.1.0",
                "decision": "revise/hold",
                "recommended_status": "review",
            }],
        }
        held = course.apply_lesson_audits(self.payload, [first, hold])
        self.assertEqual(held["lessons"][0]["review_status"], "review")

    def test_post_review_correction_replaces_sections_and_returns_to_review(self):
        topic_id = self.payload["lessons"][0]["curriculum_topic_id"]
        first = {"schema": "lesson-audit-batch/v1", "decisions": [{
            "curriculum_topic_id": topic_id, "current_version": "1.0.0",
            "decision": "revise", "proposed_version": "1.1.0", "proposed_status": "review",
            "proposed_sections": [{"type": kind, "title": kind, "content": f"Seção revisada e suficientemente completa para o teste: {kind}."}
                                  for kind in ("theory", "example", "summary")],
        }]}
        second = {"format": "lesson-independent-second-review/v1", "items": [{
            "curriculum_topic_id": topic_id, "reviewed_version": "1.1.0",
            "decision": "revise/hold", "recommended_status": "review",
        }]}
        correction = {"format": "lesson-post-review-corrections/v1", "decisions": [{
            "curriculum_topic_id": topic_id, "current_version": "1.1.0",
            "decision": "revise", "proposed_version": "1.1.1", "proposed_status": "review",
            "proposed_sections": [{"type": kind, "title": kind, "content": f"Seção corrigida e suficientemente completa para o teste: {kind}."}
                                  for kind in ("theory", "example", "summary")],
        }]}
        corrected = course.apply_lesson_audits(self.payload, [first, second, correction])
        lesson = corrected["lessons"][0]
        self.assertEqual(lesson["review_status"], "review")
        self.assertEqual(lesson["editorial_version"], "1.1.1")
        self.assertIn("corrigida", lesson["sections"][0]["content"])

    def test_each_followup_correction_requires_a_new_independent_review(self):
        topic_id = self.payload["lessons"][0]["curriculum_topic_id"]
        first = {"format": "lesson-audit-batch/v1", "decisions": [{
            "curriculum_topic_id": topic_id, "current_version": "1.0.0",
            "decision": "revise", "proposed_version": "1.1.0", "proposed_status": "review",
            "proposed_sections": [{"type": kind, "title": kind,
                                    "content": f"Seção revisada com conteúdo suficiente para conferir: {kind}."}
                                   for kind in ("theory", "example", "summary")],
        }]}
        first_review = {"format": "lesson-independent-second-review/v1", "items": [{
            "curriculum_topic_id": topic_id, "reviewed_version": "1.1.0",
            "decision": "revise/hold", "recommended_status": "review",
        }]}

        def correction(base, version):
            return {"format": "lesson-post-review-corrections/v1", "decisions": [{
                "curriculum_topic_id": topic_id, "current_version": base,
                "decision": "revise", "proposed_version": version, "proposed_status": "review",
                "proposed_sections": [{"type": kind, "title": kind,
                                        "content": f"Seção corrigida {version}, completa para conferir: {kind}."}
                                       for kind in ("theory", "example", "summary")],
            }]}

        correction_one = correction("1.1.0", "1.1.1")
        review_one = {"format": "lesson-independent-second-review/v1", "items": [{
            "curriculum_topic_id": topic_id, "reviewed_version": "1.1.1",
            "decision": "revise/hold", "recommended_status": "review",
        }]}
        correction_two = correction("1.1.1", "1.1.2")
        review_two = {"format": "lesson-independent-second-review/v1", "items": [{
            "curriculum_topic_id": topic_id, "reviewed_version": "1.1.2",
            "decision": "publish_candidate", "recommended_status": "published",
        }]}

        audited = course.apply_lesson_audits(
            self.payload,
            [first, first_review, correction_one, review_one, correction_two, review_two],
        )
        self.assertEqual(audited["lessons"][0]["editorial_version"], "1.1.2")
        self.assertEqual(audited["lessons"][0]["review_status"], "published")

        with self.assertRaisesRegex(ValueError, "independent review"):
            course.apply_lesson_audits(
                self.payload, [first, first_review, correction_one, correction_two]
            )

    def test_audit_rejects_stale_versions_duplicate_decisions_and_incomplete_revisions(self):
        topic_id = self.payload["lessons"][0]["curriculum_topic_id"]
        stale = {"schema": "lesson-audit-batch/v1", "decisions": [{
            "curriculum_topic_id": topic_id, "current_version": "0.9.0",
            "decision": "approve_as_is", "proposed_status": "published",
        }]}
        with self.assertRaises(ValueError):
            course.apply_lesson_audits(self.payload, [stale])

        duplicate = {"schema": "lesson-audit-batch/v1", "decisions": [{
            "curriculum_topic_id": topic_id, "decision": "hold", "proposed_status": "review",
        }, {
            "curriculum_topic_id": topic_id, "decision": "hold", "proposed_status": "review",
        }]}
        with self.assertRaises(ValueError):
            course.apply_lesson_audits(self.payload, [duplicate])

        incomplete = {"schema": "lesson-audit-batch/v1", "decisions": [{
            "curriculum_topic_id": topic_id, "current_version": "1.0.0",
            "decision": "revise", "proposed_version": "1.1.0", "proposed_status": "review",
            "proposed_sections": [{"type": "theory", "title": "Teoria", "content": "Texto suficiente para a validação da teoria."}],
        }]}
        with self.assertRaises(ValueError):
            course.apply_lesson_audits(self.payload, [incomplete])

    def test_incomplete_topic_package_fails_before_writing(self):
        self.payload["lessons"].pop()
        with self.assertRaises(ValueError):
            course.assemble(self.db, self.payload, apply=True)

    def test_only_representative_approved_booklets_are_practice_candidates(self):
        candidates = course.practice_candidates(self.db)
        self.assertTrue(candidates)
        self.assertTrue(all((item["year"], item["code"]) in [(2027, "QT"), (2026, "QX"), (2025, "QZ"), (2023, "QZ")]
                            for item in candidates))
        for item in candidates:
            self.assertEqual(self.db.execute("SELECT status FROM question_occurrences WHERE id=?", (item["id"],)).fetchone()[0], "published")

    def test_broad_subject_relations_do_not_count_as_topic_practice(self):
        candidates = course.practice_candidates(self.db)
        equivalents = course.equivalent_members(self.db)
        chosen = course.select_practice(self.db, 2479, candidates, equivalents)
        self.assertIsNotNone(chosen)
        self.assertEqual(chosen["question_id"], 2787)  # QT 51: two-variable linear system
        self.assertNotEqual(chosen["question_id"], 2784)  # QT 48: graph interpretation only

    def test_older_official_astronomy_question_remains_eligible(self):
        candidates = course.practice_candidates(self.db)
        equivalents = course.equivalent_members(self.db)
        chosen = course.select_practice(self.db, 2502, candidates, equivalents)
        self.assertIsNotNone(chosen)
        self.assertEqual(chosen["question_id"], 926)  # QZ 2023 Q34: Kepler's third law

    def test_curated_practice_overrides_choose_the_more_specific_questions(self):
        selection_path = course.ROOT / "content/editorial/unicamp-2027/practice-selections.json"
        selection_package = json.loads(selection_path.read_text())
        selections = {item["curriculum_topic_id"]: item for item in selection_package["selections"]}
        report = course.assemble(self.db, self.payload, practice_selections=selections)
        selected = {item["topic_id"]: item["practice"] for item in report["modules"]}
        expected = {
            2476: (2027, "QT", 53),
            2484: (2027, "QT", 43),
            2485: (2026, "QX", 16),
            2488: (2026, "QX", 15),
            2489: (2026, "QX", 20),
            2508: (2027, "QT", 69),
        }
        for topic_id, expected_source in expected.items():
            practice = selected[topic_id]
            self.assertEqual((practice["year"], practice["code"], practice["number"]), expected_source)
            self.assertTrue(practice["editorial_selection_reason"])
        families = [min(course.equivalent_members(self.db).get(item["question_id"], {item["question_id"]}))
                    for item in selected.values() if item]
        self.assertEqual(len(families), len(set(families)))

    def test_all_approved_pool_expands_topic_practice_without_repeating_question_families(self):
        candidates = course.practice_candidates(self.db)
        equivalents = course.equivalent_members(self.db)
        matching_topics = course.rows(self.db, """
            SELECT curriculum_topic_id,COUNT(*) AS association_count
            FROM question_canonical_topics qt
            JOIN curriculum_topic_canonical_topics ct USING (canonical_topic_id)
            WHERE ct.review_status='published' AND qt.review_status='published'
              AND ct.relation_type IN ('primary','secondary')
              AND qt.relation_type IN ('primary','secondary')
            GROUP BY curriculum_topic_id ORDER BY association_count DESC
        """)
        topic_id = matching_topics[0]["curriculum_topic_id"]
        selected = course.select_practices(
            self.db, topic_id, candidates, equivalents,
            include_all_approved=True,
        )
        families = [min(equivalents.get(item["question_id"], {item["question_id"]})) for item in selected]
        self.assertGreater(len(selected), 1)
        self.assertEqual(len(families), len(set(families)))
        self.assertTrue(all(item["year"] in (2025, 2026, 2027) for item in selected))

    def test_all_approved_course_practice_is_ordered_and_idempotent(self):
        mode = "all_approved_representatives"
        report = course.assemble(self.db, self.payload, practice_mode=mode, apply=True)
        self.assertEqual(report["practice_topics"], len(self.payload["lessons"]))
        self.assertGreater(sum(len(module["practices"]) for module in report["modules"]), len(report["modules"]))
        module = self.db.execute("""
            SELECT m.id FROM learning_course_modules m
            JOIN learning_courses c ON c.id=m.learning_course_id
            WHERE c.slug=? ORDER BY m.position LIMIT 1
        """, (course.SLUG,)).fetchone()
        positions = [row[0] for row in self.db.execute(
            "SELECT position FROM learning_course_items WHERE module_id=? ORDER BY position", (module[0],)
        )]
        self.assertEqual(positions, list(range(len(positions))))
        before = [tuple(row) for row in self.db.execute("SELECT * FROM learning_course_items ORDER BY id")]
        course.assemble(self.db, self.payload, practice_mode=mode, apply=True)
        self.assertEqual(before, [tuple(row) for row in self.db.execute("SELECT * FROM learning_course_items ORDER BY id")])
        self.assertEqual(self.db.execute("PRAGMA foreign_key_check").fetchall(), [])

    def test_practice_only_sync_preserves_lessons_first_question_and_review_identity(self):
        report = course.assemble(self.db, self.payload, practice_mode="all_approved_representatives")
        lesson_rows = [tuple(row) for row in self.db.execute("SELECT * FROM lessons ORDER BY id")]
        section_rows = [tuple(row) for row in self.db.execute("SELECT * FROM lesson_sections ORDER BY id")]
        first_steps = [tuple(row) for row in self.db.execute("""
            SELECT m.slug,i.id,i.question_occurrence_id FROM learning_course_modules m
            JOIN learning_courses c ON c.id=m.learning_course_id
            JOIN learning_course_items i ON i.module_id=m.id AND i.position=2
            WHERE c.slug=? ORDER BY m.position
        """, (course.SLUG,))]
        review_steps = [tuple(row) for row in self.db.execute("""
            SELECT m.slug,i.id,i.position FROM learning_course_modules m
            JOIN learning_courses c ON c.id=m.learning_course_id
            JOIN learning_course_items i ON i.module_id=m.id
            JOIN lessons l ON l.id=i.lesson_id
            WHERE c.slug=? AND l.slug LIKE 'unicamp-2027-%-revisao' ORDER BY m.position
        """, (course.SLUG,))]

        result = course.sync_course_practice_items(self.db, report)
        self.assertGreater(result["practice_items"], result["modules"])
        self.assertEqual(lesson_rows, [tuple(row) for row in self.db.execute("SELECT * FROM lessons ORDER BY id")])
        self.assertEqual(section_rows, [tuple(row) for row in self.db.execute("SELECT * FROM lesson_sections ORDER BY id")])
        self.assertEqual(first_steps, [tuple(row) for row in self.db.execute("""
            SELECT m.slug,i.id,i.question_occurrence_id FROM learning_course_modules m
            JOIN learning_courses c ON c.id=m.learning_course_id
            JOIN learning_course_items i ON i.module_id=m.id AND i.position=2
            WHERE c.slug=? ORDER BY m.position
        """, (course.SLUG,))])
        self.assertEqual([row[:2] for row in review_steps], [tuple(row) for row in self.db.execute("""
            SELECT m.slug,i.id FROM learning_course_modules m
            JOIN learning_courses c ON c.id=m.learning_course_id
            JOIN learning_course_items i ON i.module_id=m.id
            JOIN lessons l ON l.id=i.lesson_id
            WHERE c.slug=? AND l.slug LIKE 'unicamp-2027-%-revisao' ORDER BY m.position
        """, (course.SLUG,))])

        for module in report["modules"]:
            module_row = self.db.execute("""
                SELECT m.id FROM learning_course_modules m JOIN learning_courses c ON c.id=m.learning_course_id
                WHERE c.slug=? AND m.slug=?
            """, (course.SLUG, f"topico-{module['topic_id']}")).fetchone()
            items = self.db.execute("SELECT position,item_type FROM learning_course_items WHERE module_id=? ORDER BY position",
                                    (module_row[0],)).fetchall()
            self.assertEqual([item[0] for item in items], list(range(len(items))))
            self.assertEqual(items[-1][1], "lesson")

        after = [tuple(row) for row in self.db.execute("SELECT * FROM learning_course_items ORDER BY id")]
        course.sync_course_practice_items(self.db, report)
        self.assertEqual(after, [tuple(row) for row in self.db.execute("SELECT * FROM learning_course_items ORDER BY id")])
        self.assertEqual(self.db.execute("PRAGMA foreign_key_check").fetchall(), [])

    def test_curated_practice_override_rejects_changed_source_evidence(self):
        candidates = course.practice_candidates(self.db)
        equivalents = course.equivalent_members(self.db)
        preferred = {"year": 2027, "code": "QT", "number": 53,
                     "source_document_id": 335, "source_page": 999,
                     "reason": "Regression test"}
        with self.assertRaisesRegex(ValueError, "source page changed"):
            course.select_practice(self.db, 2476, candidates, equivalents, preferred=preferred)

    def test_mechanics_example_requires_a_fixed_support_for_downward_reaction(self):
        package_path = course.ROOT / "content/editorial/unicamp-2027/lessons.json"
        revisions_path = course.ROOT / "content/editorial/unicamp-2027/lesson-revisions.json"
        package = json.loads(package_path.read_text())
        revisions = json.loads(revisions_path.read_text())
        revised = course.apply_revisions(package, revisions)
        lesson = next(item for item in revised["lessons"] if item["curriculum_topic_id"] == 2501)
        example = next(item["content"] for item in lesson["sections"] if item["type"] == "example")
        self.assertEqual(lesson["editorial_version"], "1.2.1")
        self.assertIn("presa a uma estrutura rígida", example)
        self.assertIn("não apenas apoiada por contato", example)

    def test_unmatched_practice_slot_is_an_explicit_gap_not_a_stale_question(self):
        self.db.execute("UPDATE curriculum_topic_canonical_topics SET review_status='review' WHERE curriculum_topic_id=2469")
        course.assemble(self.db, self.payload, apply=True)
        row = self.db.execute("""
            SELECT i.item_type,i.title,i.question_occurrence_id,i.lesson_id,l.review_status,l.intro
            FROM learning_course_items i
            JOIN learning_course_modules m ON m.id=i.module_id
            JOIN learning_courses c ON c.id=m.learning_course_id
            LEFT JOIN lessons l ON l.id=i.lesson_id
            WHERE c.slug=? AND m.slug='topico-2469' AND i.position=2
        """, (course.SLUG,)).fetchone()
        self.assertEqual(row[0], "lesson")
        self.assertEqual(row[1], "Prática ainda não validada")
        self.assertIsNone(row[2])
        self.assertEqual(row[4], "review")
        self.assertIn("Nenhuma questão", row[5])


if __name__ == "__main__":
    unittest.main()
