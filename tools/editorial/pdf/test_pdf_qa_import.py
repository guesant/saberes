import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


MODULE_PATH = Path(__file__).with_name("pdf_qa_import.py")
SPEC = importlib.util.spec_from_file_location("pdf_qa_import", MODULE_PATH)
qa = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(qa)


class ParseQuestionsTests(unittest.TestCase):
    def test_parses_seventy_two_ordered_questions_with_four_options(self):
        source = "\n".join(
            f"## QUESTÃO {n}\nPergunta {n}?\nA) opção a\nB) opção b\nC) opção c\nD) opção d"
            for n in range(1, 73)
        )
        parsed, issues = qa.parse_questions(source)
        self.assertEqual(len(parsed), 72)
        self.assertEqual(set(parsed[72]["options"]), {"A", "B", "C", "D"})
        self.assertEqual(issues, [])

    def test_reports_order_duplicate_and_bad_options(self):
        parsed, issues = qa.parse_questions("## QUESTAO 2\nTexto\nA) a\nB) b\nB) repetida\nE) e\n## QUESTÃO 2\n")
        self.assertEqual(len(parsed), 1)
        self.assertTrue(any("order" in issue for issue in issues))
        self.assertTrue(any("duplicate" in issue for issue in parsed[2]["issues"]))
        self.assertTrue(any("options_not_exactly" in issue for issue in parsed[2]["issues"]))

    def test_clean_preserves_math_and_markdown_punctuation(self):
        self.assertEqual(qa.clean(r"$x_i * y$ **bold**"), r"$x_i * y$ **bold**")

    def test_text_similarity_normalizes_line_wrap_and_punctuation(self):
        score = qa.text_similarity("A alterna-\ntiva, correta!", "A alternativa correta")
        self.assertEqual(score, 1.0)

    def test_text_comparison_is_triage_only_and_marks_image_content(self):
        strong = qa.compare_extracted_text("Enunciado simples.", "Enunciado simples",
                                           {"A": "sim", "B": "não"},
                                           {"A": "sim", "B": "não"})
        self.assertEqual(strong["triage"], "strong_text_overlap")
        self.assertFalse(strong["isApproval"])
        partial = qa.compare_extracted_text("Qual gráfico?", "Qual gráfico?", {},
                                            {"A": "gráfico A", "B": "gráfico B"})
        self.assertEqual(partial["triage"], "partial_text_or_image_content")

    def test_parses_inline_options(self):
        parsed, _ = qa.parse_questions(
            "## QUESTÃO 1\nQual corrente? a) 2 mA. b) 5 A. c) 8 A. - d) 0,5 mA."
        )
        self.assertEqual(set(parsed[1]["options"]), {"A", "B", "C", "D"})
        self.assertEqual(parsed[1]["options"]["A"], "2 mA.")
        self.assertEqual(parsed[1]["options"]["D"], "0,5 mA.")
        self.assertFalse(any("options_not_exactly" in issue for issue in parsed[1]["issues"]))

    def test_parses_markdown_table_options(self):
        parsed, _ = qa.parse_questions(
            "## QUESTÃO 1\nSelecione a escala.\n"
            "| a) | 1:20.000.000 | 4508 km |\n|----|----|----|\n"
            "| b) | 1:2.000.000 | 450,8 km |\n"
            "| c) | 1:20.000.000 | 450,8 km |\n"
            "| d) | 1:2.000.000 | 4508 km |"
        )
        self.assertEqual(set(parsed[1]["options"]), {"A", "B", "C", "D"})
        self.assertEqual(parsed[1]["options"]["C"], "1:20.000.000 | 450,8 km")
        self.assertFalse(parsed[1]["issues"])

    def test_flags_spill_option_labels_and_prefers_labeled_table(self):
        parsed, _ = qa.parse_questions(
            "## QUESTÃO 1\nEnunciado.\n- a) texto spill A\n- b) texto spill B\n- c) texto spill C\n"
            "| a) | alternativa A | valor A |\n|----|----|----|\n"
            "| b) | alternativa B | valor B |\n| c) | alternativa C | valor C |\n"
            "| d) | alternativa D | valor D |"
        )
        self.assertEqual(set(parsed[1]["options"]), {"A", "B", "C", "D"})
        self.assertTrue(any(issue.startswith("spill_option_labels") for issue in parsed[1]["issues"]))

    def test_does_not_infer_options_from_graphic_or_formula_text(self):
        parsed, _ = qa.parse_questions("## QUESTÃO 1\n<!-- image -->\n$A=B+C$\n")
        self.assertEqual(parsed[1]["options"], {})
        self.assertIn("options_not_exactly_A_to_D", parsed[1]["issues"])

    def test_classifies_image_only_alternatives_as_visual_review_not_missing_text_codes(self):
        issues = qa.classify_option_extraction(
            ["options_not_exactly_A_to_D", "extracted_option_codes_do_not_match_database"],
            [], ["A", "B", "C", "D"],
            "Qual gráfico representa a posição? <!-- image --> <!-- image -->",
        )
        self.assertEqual(issues, ["image_only_alternatives_require_visual_review"])

    def test_image_only_review_classification_does_not_infer_or_approve_options(self):
        issues = qa.classify_option_extraction(
            ["options_not_exactly_A_to_D"], [], ["A", "B", "C", "D"],
            "Enunciado com <!-- image -->",
        )
        self.assertIn("image_only_alternatives_require_visual_review", issues)
        self.assertTrue(issues)

    def test_detects_unresolved_pdf_cid_glyph_artifacts(self):
        self.assertTrue(qa.has_pdf_cid_artifact("x(cid:2870) + qx(cid:3397)r"))
        self.assertFalse(qa.has_pdf_cid_artifact("x² + qx + r = 0"))


class ExtractorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.stub = self.root / "extractor_stub.py"
        self.stub.write_text(
            "import pathlib,sys\n"
            "pdf,out,pages,log=sys.argv[1:]\n"
            "pathlib.Path(log).write_text(pathlib.Path(log).read_text() + pages + '\\n' if pathlib.Path(log).exists() else pages + '\\n')\n"
            "pathlib.Path(out).write_text('sample from ' + pathlib.Path(pdf).name + ' pages=' + pages)\n",
            encoding="utf-8",
        )
        self.pdf = self.root / "source.pdf"
        self.pdf.write_bytes(b"stub PDF bytes")
        self.manifest = self.root / "review" / "manifest.json"
        self.manifest.parent.mkdir()
        self.manifest.write_text("{}", encoding="utf-8")
        self.cache = self.root / "cache"
        self.log = self.root / "calls.log"
        self.command = f'"{sys.executable}" "{self.stub}" {{pdf}} {{output}} {{page_limit}} "{self.log}"'
        self.booklet = {"edition": 2030, "booklet": "AB", "source": "source.pdf"}

    def tearDown(self):
        self.temp.cleanup()

    def test_command_substitutes_actual_pdf_output_and_page_limit(self):
        output = self.root / "actual-output.md"
        qa.run_extractor(self.command, self.pdf, output, "2", "config")
        self.assertIn("pages=2", output.read_text())
        self.assertEqual(self.log.read_text().splitlines(), ["2"])

    def test_calibration_stops_at_two_pages_and_approval_binds_all_hashes(self):
        row = qa.calibrate_extractor(self.booklet, self.manifest, self.cache, self.command)
        self.assertTrue(row["awaitingHumanReview"])
        self.assertEqual(self.log.read_text().splitlines(), ["2"])
        approval = self.root / "approval.json"
        approval.write_text(json.dumps({"approvals": [{**row, "approved": True, "reviewer": "human"}]}))
        qa.verify_calibration_approvals([self.booklet], self.manifest, self.cache, self.command, approval)
        extracted, error = qa.maybe_extract(self.booklet, self.manifest, self.cache, self.command)
        self.assertIsNone(error)
        self.assertEqual(self.log.read_text().splitlines(), ["2", "all"])
        self.assertTrue(extracted.is_file())

    def test_calibration_approval_rejects_changed_sample_hash(self):
        row = qa.calibrate_extractor(self.booklet, self.manifest, self.cache, self.command)
        approval = self.root / "approval.json"
        row["sampleSha256"] = "0" * 64
        approval.write_text(json.dumps({"approvals": [{**row, "approved": True, "reviewer": "human"}]}))
        with self.assertRaisesRegex(ValueError, "does not match"):
            qa.verify_calibration_approvals([self.booklet], self.manifest, self.cache, self.command, approval)


class PublishedRepairTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.database = self.root / "content.sqlite"
        self.pdf = self.root / "source.pdf"
        self.pdf.write_bytes(b"reviewed primary-source PDF")
        self.manifest = self.root / "manifest-area" / "manifest.json"
        self.manifest.parent.mkdir()
        booklet = {"edition": 2030, "booklet": "AB", "sourceDocumentId": 7,
                   "source": "source.pdf", "sourceSha256": qa.sha256(self.pdf)}
        self.manifest.write_text(json.dumps({"booklets": [booklet]}), encoding="utf-8")
        db = __import__("sqlite3").connect(self.database)
        db.executescript(
            "CREATE TABLE questions(id INTEGER PRIMARY KEY,status TEXT NOT NULL,statement TEXT NOT NULL);"
            "CREATE TABLE question_occurrences(id INTEGER PRIMARY KEY,question_id INTEGER NOT NULL,"
            "source_document_id INTEGER NOT NULL,status TEXT NOT NULL);"
            "CREATE TABLE question_options(id INTEGER PRIMARY KEY,question_id INTEGER NOT NULL,code TEXT NOT NULL,text TEXT NOT NULL);"
            "CREATE TABLE canonical_answer_keys(id INTEGER PRIMARY KEY,question_id INTEGER NOT NULL);"
            "INSERT INTO questions VALUES(41,'published','Old statement');"
            "INSERT INTO question_occurrences VALUES(51,41,7,'published');"
            "INSERT INTO question_options VALUES(61,41,'A','Old option A');"
            "INSERT INTO canonical_answer_keys VALUES(71,41);"
        )
        db.commit()
        db.close()
        self.history = self.root / "repair-history.json"
        self.plan = self.root / "repairs.jsonl"

    def tearDown(self):
        self.temp.cleanup()

    def record(self, *, field="statement", current="Old statement", new="Corrected statement", approved=True):
        return {"sourceDocumentId": 7, "occurrenceId": 51, "questionId": 41,
                "sourcePdfSha256": qa.sha256(self.pdf), "field": field,
                "expectedCurrentValue": current, "expectedCurrentSha256": qa.text_hash(current),
                "newValue": new, "reason": "Verified against the cited source page.",
                "evidence": "Source PDF p. 4, question 12", "reviewer": "editorial-reviewer",
                "approved": approved}

    def write_plan(self, *records):
        self.plan.write_text("".join(json.dumps(row) + "\n" for row in records), encoding="utf-8")

    def read_db(self):
        import sqlite3
        db = sqlite3.connect(self.database)
        rows = (db.execute("SELECT id,status,statement FROM questions").fetchone(),
                db.execute("SELECT id,question_id,source_document_id,status FROM question_occurrences").fetchone(),
                db.execute("SELECT id,question_id,code,text FROM question_options").fetchone(),
                db.execute("SELECT id,question_id FROM canonical_answer_keys").fetchone())
        db.close()
        return rows

    def test_published_repair_requires_explicit_approval_and_preserves_identity(self):
        row = self.record(approved=False)
        self.write_plan(row)
        with self.assertRaisesRegex(ValueError, "approved=true"):
            qa.run_repair_plan(self.database, self.manifest, self.plan, self.history)
        self.assertEqual(self.read_db()[0], (41, "published", "Old statement"))

        row["approved"] = True
        option = self.record(field="option:A", current="Old option A", new="Corrected option A")
        self.write_plan(row, option)
        preview = qa.run_repair_plan(self.database, self.manifest, self.plan, self.history)
        self.assertEqual(preview["mode"], "dry-run")
        self.assertFalse(preview["databaseModified"])
        result = qa.run_repair_plan(self.database, self.manifest, self.plan, self.history, apply=True)
        self.assertTrue(result["databaseModified"])
        self.assertEqual(self.read_db(), ((41, "published", "Corrected statement"),
                                          (51, 41, 7, "published"),
                                          (61, 41, "A", "Corrected option A"), (71, 41)))

    def test_bad_second_record_rolls_back_first_update(self):
        first = self.record()
        second = self.record(field="option:A", current="Old option A", new="Corrected option")
        self.write_plan(first, second)
        real_apply = qa.apply_repair_field
        calls = 0

        def fail_on_second(db, row):
            nonlocal calls
            calls += 1
            if calls == 2:
                raise RuntimeError("injected second-row write failure")
            real_apply(db, row)

        with patch.object(qa, "apply_repair_field", side_effect=fail_on_second):
            with self.assertRaisesRegex(RuntimeError, "second-row write failure"):
                qa.run_repair_plan(self.database, self.manifest, self.plan, self.history, apply=True)
        self.assertEqual(self.read_db()[0], (41, "published", "Old statement"))
        self.assertEqual(self.read_db()[2], (61, 41, "A", "Old option A"))
        self.assertFalse(self.history.exists())
        self.assertFalse(qa.pending_journal_path(self.history).exists())

    def test_history_write_failure_keeps_journal_and_replay_recovers_history(self):
        self.write_plan(self.record())
        with patch.object(qa, "write_repair_history", side_effect=OSError("injected sidecar failure")):
            with self.assertRaisesRegex(OSError, "sidecar failure"):
                qa.run_repair_plan(self.database, self.manifest, self.plan, self.history, apply=True)
        pending = qa.pending_journal_path(self.history)
        self.assertTrue(pending.is_file())
        self.assertFalse(self.history.exists())
        self.assertEqual(self.read_db()[0], (41, "published", "Corrected statement"))

        replay = qa.run_repair_plan(self.database, self.manifest, self.plan, self.history, apply=True)
        self.assertTrue(replay["idempotentReplay"])
        self.assertEqual(replay["recovery"]["recovery"], "completed_committed_history")
        self.assertFalse(pending.exists())
        sidecar = json.loads(self.history.read_text())
        self.assertEqual(len(sidecar["history"]), 1)

    def test_unmatched_occurrence_or_source_is_refused(self):
        row = self.record()
        row["occurrenceId"] = 999
        self.write_plan(row)
        with self.assertRaisesRegex(ValueError, "unmatched occurrenceId"):
            qa.run_repair_plan(self.database, self.manifest, self.plan, self.history)

        row = self.record()
        row["sourceDocumentId"] = 999
        self.write_plan(row)
        with self.assertRaisesRegex(ValueError, "sourceDocumentId is unmatched"):
            qa.run_repair_plan(self.database, self.manifest, self.plan, self.history)

    def test_reapplying_same_plan_is_idempotent_and_history_is_appended_once(self):
        self.write_plan(self.record())
        first = qa.run_repair_plan(self.database, self.manifest, self.plan, self.history, apply=True)
        self.assertTrue(first["databaseModified"])
        second = qa.run_repair_plan(self.database, self.manifest, self.plan, self.history, apply=True)
        self.assertFalse(second["databaseModified"])
        self.assertTrue(second["idempotentReplay"])
        sidecar = json.loads(self.history.read_text())
        self.assertEqual(len(sidecar["history"]), 1)
        self.assertEqual(self.read_db()[0], (41, "published", "Corrected statement"))


if __name__ == "__main__":
    unittest.main()
