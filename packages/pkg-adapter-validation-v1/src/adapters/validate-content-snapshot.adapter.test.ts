import { describe, expect, it } from "vitest";
import { ValidateContentSnapshotAdapter } from "./validate-content-snapshot.adapter";
import type { ContentSnapshotValidationInput } from "@guesant/saberes-application";

const requiredContentSnapshotTables = [
  "universities",
  "organizers",
  "admission_processes",
  "editions",
  "source_documents",
  "stages",
  "papers",
  "languages",
  "paper_versions",
  "subjects",
  "campuses",
  "admission_modalities",
  "course_stage_requirements",
  "assessment_areas",
  "paper_subjects",
  "questions",
  "question_occurrences",
  "question_options",
  "question_parts",
  "answer_keys",
  "answer_key_options",
  "grading_rubrics",
  "question_sources",
  "curricula",
  "topics",
  "topic_subjects",
  "curriculum_topics",
  "topic_relations",
  "question_topics",
  "lessons",
  "lesson_sections",
  "lesson_sources",
  "lesson_topics",
  "resources",
  "resource_topics",
  "assessment_sets",
  "assessment_set_items",
  "degree_programs",
  "course_offerings",
  "learning_courses",
  "learning_course_modules",
  "learning_course_items",
  "learning_course_topics",
  "learning_course_targets",
  "learning_maps",
  "learning_map_topics",
  "learning_map_edges",
  "study_plans",
  "study_plan_steps",
  "question_relations",
  "essay_prompts",
  "essay_evaluations",
  "scoring_rules",
  "content_releases",
];

const validInput: ContentSnapshotValidationInput = {
  tables: [...requiredContentSnapshotTables],
  questionCount: 1,
  publishedProcessCount: 1,
  publishedCourseCount: 1,
  assessmentSetCount: 1,
  orphanOccurrenceCount: 0,
  missingOccurrenceKeyCount: 0,
  orphanCourseItemCount: 0,
  orphanPlanStepCount: 0,
  invalidBlockCount: 0,
  invalidRoleCount: 0,
  incompleteLessonCount: 0,
  invalidLessonMetadataCount: 0,
  orphanLessonSourceCount: 0,
  invalidLessonSectionCount: 0,
};

describe("ValidateContentSnapshotAdapter", () => {
  it("accepts a complete editorial snapshot", async () => {
    const adapter = new ValidateContentSnapshotAdapter();

    const result = await adapter.execute(validInput);

    expect(result).toEqual({
      status: "valid",
      issues: [],
      summary: {
        tableCount: requiredContentSnapshotTables.length,
        questionCount: 1,
        publishedProcessCount: 1,
        publishedCourseCount: 1,
        assessmentSetCount: 1,
        issueCount: 0,
      },
    });
  });

  it("reports missing tables and invalid snapshot counts", async () => {
    const adapter = new ValidateContentSnapshotAdapter();

    const result = await adapter.execute({
      ...validInput,
      tables: ["questions"],
      questionCount: 0,
      publishedProcessCount: 0,
      publishedCourseCount: 0,
      assessmentSetCount: 0,
    });

    expect(result.status).toBe("invalid");

    expect(result.issues).toHaveLength(requiredContentSnapshotTables.length + 3);

    expect(result.issues[0]).toEqual({
      code: "tables.missing",
      path: "tables.universities",
      message: "Required table is missing: universities.",
    });

    expect(result.issues[result.issues.length - 1]).toEqual({
      code: "assessment-sets.empty",
      path: "assessment_sets",
      message: "The snapshot does not contain assessment sets.",
    });
  });

  it("reports each invalid relationship and editorial rule", async () => {
    const adapter = new ValidateContentSnapshotAdapter();

    const result = await adapter.execute({
      ...validInput,
      orphanOccurrenceCount: 1,
      missingOccurrenceKeyCount: 1,
      orphanCourseItemCount: 1,
      orphanPlanStepCount: 1,
      invalidBlockCount: 1,
      invalidRoleCount: 1,
      incompleteLessonCount: 1,
      invalidLessonMetadataCount: 1,
      orphanLessonSourceCount: 1,
      invalidLessonSectionCount: 1,
    });

    expect(result.issues.map((issue) => issue.code)).toEqual([
      "question-occurrences.orphaned",
      "question-occurrences.key-missing",
      "course-items.orphaned",
      "plan-steps.orphaned",
      "lesson-sections.blocks-invalid",
      "lesson-sections.role-invalid",
      "lessons.progression-incomplete",
      "lessons.metadata-invalid",
      "lesson-sources.orphaned",
      "lesson-sections.invalid",
    ]);
  });
});
