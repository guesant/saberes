# Bulk PDF QA and import

`pdf_qa_import.py` checks an extraction manifest, source PDFs, existing Docling Markdown, question numbering, option structure, canonical answer-key references, and text overlap between extraction and SQLite. It uses only Python's standard library. Default invocation is read-only and selects one booklet per exam: 2025 QZ, 2026 QX, and 2027 QT.

```sh
python3 tools/editorial/pdf/pdf_qa_import.py --dry-run
python3 tools/editorial/pdf/pdf_qa_import.py --database PATH --manifest PATH --booklets 2025:QZ,2026:QX --output report.jsonl
```

The report is JSONL: batch header, booklet summaries, then one candidate per matched question. Similarity scores are automatic triage signals only: they never approve, replace, or edit SQLite text. Strong overlap helps skip routine manual comparison; low overlap and image-only material are surfaced as exceptions. Figure candidates include source-page provenance and hashes. The app opens the original PDF page, so this workflow does not require figure crops or per-image inspection.

For optional extraction, pass an argv template (quoted as one shell argument) with `{pdf}` and `{output}` placeholders. `{page_limit}` is `2` for calibration and `all` for the full run. The extractor must honor the page limit. Cache keys include the source PDF SHA-256 and exact command configuration; a changed input/configuration gets a new entry. Calibration Markdown is retained beside its cache entry as `*.calibration-2-pages.md`. `--calibrate` is sample-only and exits without full extraction. Review the two-page sample's text structure and automated overlap summary before generating the rest. Full extraction requires an approval JSON binding the source PDF, command configuration, and sample hash for every selected booklet. The command runs without a shell.

```sh
python3 tools/editorial/pdf/pdf_qa_import.py --extract-command 'my-extractor --input {pdf} --output {output} --pages {page_limit}' --calibrate --output calibration.json
python3 tools/editorial/pdf/pdf_qa_import.py --extract-command 'my-extractor --input {pdf} --output {output} --pages {page_limit}' --calibration-approval calibration-approved.json
```

`calibration-approved.json` has the shape `{"approvals":[{"edition":2025,"booklet":"QZ","sourcePdfSha256":"...","commandConfigSha256":"...","samplePath":"...","sampleSha256":"...","awaitingHumanReview":true,"approved":true,"reviewer":"name"}]}`; include one record per selected booklet. The review flags field content containing math/Markdown punctuation without stripping those characters. Such flags require explicit acknowledgement in `reviewedFlags` on any apply row.

Import is opt-in and requires a separately reviewed JSONL (`--apply --reviewed ...`). Each row must carry `approved: true`, a reviewer, the matching source PDF hash, one exact `field` (`statement` or `option`), and that field in `reviewedFields`. Apply refuses any batch failing structural QA, refuses published questions, backs up the database with SQLite's backup API, and performs updates in one transaction. Do not approve Docling text as a replacement for published corrected text; preserve reviewed corrections and repair OCR against the rendered source instead. This utility does not create or change courses, source-document records, question occurrences, answer keys, or publication state.

Published corrections use a separate, explicit sidecar plan and default to dry-run:

```sh
python3 tools/editorial/pdf/pdf_qa_import.py --repair-plan repairs.jsonl
python3 tools/editorial/pdf/pdf_qa_import.py --repair-plan repairs.jsonl --apply-repairs --repair-history published-repair-history.json
```

Each repair JSONL row must include `approved: true`, `sourceDocumentId`, `occurrenceId`, `questionId`, `sourcePdfSha256`, exact `field` (`statement` or `option:A` through `option:D`), `expectedCurrentValue`, its UTF-8 SHA-256 as `expectedCurrentSha256`, `newValue`, `reason`, `evidence`, and `reviewer`. The runner matches the source ID to the manifest and verifies the actual PDF hash; it also confirms the occurrence belongs to that question/source and that the current field still matches both expected value and hash. It updates only the named statement or option, preserving IDs, statuses, and answer keys. `--apply-repairs` makes a SQLite backup and applies the whole batch in one transaction; any stale or unmatched row rolls back all updates. Before the transaction, it durably writes `<repair-history>.pending.json` with the exact approved rows and backup path. After commit it appends history to the JSON sidecar, then removes the pending journal. If history writing fails after commit, keep the pending file and rerun the same `--repair-plan ... --apply-repairs --repair-history ...` command: the runner verifies that all targeted fields equal their planned new values, completes the missing history entry, removes the journal, and returns an idempotent replay. If all targeted fields still equal their expected old values, it removes the unused pending journal and retries the plan. Mixed or divergent values stop for manual recovery and preserve the journal. Successful rows are appended to the JSON history sidecar. Replaying the exact plan is idempotent when history and current values agree. This workflow is independent of extraction QA and does not require a clean Docling batch.

Known limits: the structural option contract is A-D as used by the configured Unicamp multiple-choice booklets; unusual item formats need explicit parser work. Canonical keys are checked for presence and option-reference integrity, not recomputed from the PDF. Similarity cannot validate figures, mathematical meaning, or answer-key correctness. This workflow deliberately preserves existing question text and surfaces uncertain cases instead of requiring slow visual review or silently changing the database. The caller remains responsible for course setup and any broader database editorial workflow.
