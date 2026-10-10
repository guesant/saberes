import { hasContentColumn } from "./has-content-column.function";
import { hasContentTable } from "./has-content-table.function";
import { mapQuestionDetailsReadModel } from "./map-question-details-read-model.function";
import { mapQuestionPartReadModel } from "./map-question-part-read-model.function";
import { mapTopicQuestionReadModel } from "./map-topic-question-read-model.function";
import { readQuestionAnswer } from "./read-question-answer.function";
import { readQuestionOptions } from "./read-question-options.function";
import { readQuestionPdfPages } from "./read-question-pdf-pages.function";
import { readQuestionRow } from "./read-question-row.function";
import { readQuestionTopics } from "./read-question-topics.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { QuestionReadModel } from "@guesant/saberes-application";
import type { TrainingScope } from "@guesant/saberes-domain";

export function readContentQuestion(
    db: ContentDatabase,
    key: string,
    scope?: TrainingScope,
): QuestionReadModel | null {
    const row = readQuestionRow(db, key, scope);

    if (!row) {
    return null;
  }

  const pdfPages = [
    "question_occurrences",
    "papers",
    "paper_versions",
    "stages",
    "editions",
    "source_documents",
    "content_assets",
  ].every((table) => hasContentTable(db, table))
    ? readQuestionPdfPages(
        db,
        Number(row.question_id),
        row.occurrence_id == null ? null : Number(row.occurrence_id),
        scope?.targetEditionSlug,
      )
    : [];

  return {
        question: mapQuestionDetailsReadModel({
            ...row,
            ...readQuestionAnswer(db, row),
            target_edition_slug: scope?.targetEditionSlug,
            target_stage_slug: scope?.targetStageSlug,
        }),
        options: readQuestionOptions(db, row),
        parts: db
            .query(
                "SELECT * FROM question_parts WHERE question_id = ? ORDER BY position",
                [row.question_id],
            )
            .map(mapQuestionPartReadModel),
        topics: readQuestionTopics(db, row, scope),
        related: db
            .query(
                "SELECT DISTINCT qo2.id, qo2.id occurrence_id, qo2.number, q.slug, q.statement, q.difficulty FROM question_topics qt1 JOIN question_topics qt2 ON qt2.curriculum_topic_id = qt1.curriculum_topic_id JOIN question_occurrences qo2 ON qo2.id = qt2.question_occurrence_id JOIN questions q ON q.id = qo2.question_id WHERE qt1.question_occurrence_id = ? AND qo2.id <> ? AND q.status = 'published' LIMIT 4",
                [row.occurrence_id || 0, row.occurrence_id || 0],
            )
            .map(mapTopicQuestionReadModel),
        contexts:
            hasContentTable(db, "question_stimuli") &&
            hasContentTable(db, "stimuli")
                ? db
                      .query(
                          "SELECT s.id, s.title, s.content, qs.position FROM question_stimuli qs JOIN stimuli s ON s.id = qs.stimulus_id WHERE qs.question_id = ? ORDER BY qs.position",
                          [row.question_id],
                      )
                      .map((item) => {
                          const assets =
                              pdfPages.length === 0 &&
                              hasContentTable(db, "stimulus_assets") &&
                              hasContentTable(db, "content_assets")
                                  ? db
                                        .query(
                                            "SELECT a.id, a.path, a.media_type, a.alt_text, sa.position FROM stimulus_assets sa JOIN content_assets a ON a.id = sa.asset_id WHERE sa.stimulus_id = ? ORDER BY sa.position",
                                            [item.id],
                                        )
                                        .map((asset) => ({
                                            id: Number(asset.id),
                                            path: String(asset.path),
                                            mediaType: String(asset.media_type),
                                            altText: String(asset.alt_text),
                                            position: Number(asset.position),
                                        }))
                                  : [];

                          return {
                              id: Number(item.id),
                              title: String(item.title || ""),
                              content: String(item.content),
                              position: Number(item.position),
                              assets,
                          };
                      })
                : [],
        assets:
            hasContentTable(db, "question_assets") &&
            hasContentTable(db, "content_assets")
                ? db
                      .query(
                          "SELECT a.id, a.path, a.media_type, a.alt_text, qa.position FROM question_assets qa JOIN content_assets a ON a.id = qa.asset_id WHERE qa.question_id = ? ORDER BY qa.position, a.id",
                          [row.question_id],
                      )
                      .map((asset) => ({
                          id: Number(asset.id),
                          path: String(asset.path),
                          mediaType: String(asset.media_type),
                          altText: String(asset.alt_text),
                          position: Number(asset.position),
                      }))
                : [],
        pdfPages,
        solutions: hasContentTable(db, "question_solutions")
            ? db
                  .query(
                      `SELECT qs.id, qs.title, qs.content, qs.position, ${hasContentColumn(db, "question_solutions", "editorial_status") ? "COALESCE(qs.editorial_status, 'published')" : "'published'"} AS editorial_status, ${hasContentColumn(db, "question_solutions", "editorial_version") ? "qs.editorial_version" : "NULL"} AS editorial_version, ${hasContentColumn(db, "question_solutions", "authorship") ? "qs.authorship" : "NULL"} AS authorship, sd.url AS source_url, sd.title AS source_title FROM question_solutions qs LEFT JOIN source_documents sd ON sd.id=qs.source_document_id WHERE qs.question_id = ? ORDER BY qs.position`,
                      [row.question_id],
                  )
                  .map((item) => {
                      return {
                          id: Number(item.id),
                          title: String(item.title),
                          content: String(item.content),
                          position: Number(item.position),
                          editorialStatus: item.editorial_status === "draft" || item.editorial_status === "review"
                              ? item.editorial_status
                              : "published",
                          editorialVersion: item.editorial_version == null ? null : String(item.editorial_version),
                          authorship: item.authorship == null ? null : String(item.authorship),
                          sourceUrl: item.source_url == null ? null : String(item.source_url),
                          sourceTitle: item.source_title == null ? null : String(item.source_title),
                      };
                  })
            : [],
        hints: hasContentTable(db, "question_hints")
            ? db
                  .query(
                      "SELECT id, content, position FROM question_hints WHERE question_id = ? ORDER BY position",
                      [row.question_id],
                  )
                  .map((item) => {
                      return {
                          id: Number(item.id),
                          content: String(item.content),
                          position: Number(item.position),
                      };
                  })
            : [],
        skills: hasContentTable(db, "question_skills")
            ? db
                  .query(
                      "SELECT sk.id, sk.slug, sk.name, qsk.relation_type FROM question_skills qsk JOIN skills sk ON sk.id = qsk.skill_id WHERE qsk.question_id = ? AND sk.is_published = 1 ORDER BY qsk.relation_type, sk.name",
                      [row.question_id],
                  )
                  .map((item) => {
                      return {
                          id: Number(item.id),
                          slug: String(item.slug),
                          name: String(item.name),
                          relationType: String(item.relation_type),
                      };
                  })
            : [],
        optionExplanations: hasContentTable(db, "question_option_explanations")
            ? db
                  .query(
                      "SELECT question_option_id, content, diagnosis_code FROM question_option_explanations WHERE question_option_id IN (SELECT id FROM question_options WHERE question_id = ?)",
                      [row.question_id],
                  )
                  .map((item) => {
                      return {
                          optionId: Number(item.question_option_id),
                          content: String(item.content),
                          diagnosisCode:
                              item.diagnosis_code === null ||
                              item.diagnosis_code === undefined
                                  ? null
                                  : String(item.diagnosis_code),
                      };
                  })
            : [],
        subjectIds: hasContentTable(db, "question_subjects")
            ? db
                  .query(
                      "SELECT subject_id FROM question_subjects WHERE question_id = ? ORDER BY is_primary DESC, subject_id",
                      [row.question_id],
                  )
                  .map((item) => {
                      return Number(item.subject_id);
                  })
            : [],
    };
}
