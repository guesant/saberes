import type {
  ContentSnapshotValidationInput,
  ContentSnapshotValidationIssue,
  ContentSnapshotValidationResult,
  ValidateContentSnapshotPort,
} from "@guesant/saberes-application";

export class ValidateContentSnapshotAdapter implements ValidateContentSnapshotPort {
  private static readonly requiredTables = [
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
    "exam_components",
    "course_exam_criteria",
    "course_offering_thresholds",
    "course_vacancy_allocations",
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

  public async execute(
    input: ContentSnapshotValidationInput,
  ): Promise<ContentSnapshotValidationResult> {
    const missingTables = ValidateContentSnapshotAdapter.requiredTables.filter((table) => {
      return !input.tables.includes(table);
    });

    const countChecks = [
      {
        code: "questions.empty",
        count: input.questionCount,
        path: "questions",
        message: "The snapshot does not contain questions.",
      },
      {
        code: "processes.empty",
        count: input.publishedProcessCount,
        path: "admission_processes",
        message: "The snapshot does not contain published admission processes.",
      },
      {
        code: "courses.empty",
        count: input.publishedCourseCount,
        path: "learning_courses",
        message: "The snapshot does not contain editorial courses.",
      },
      {
        code: "assessment-sets.empty",
        count: input.assessmentSetCount,
        path: "assessment_sets",
        message: "The snapshot does not contain assessment sets.",
      },
    ];

    const relationChecks = [
      {
        code: "question-occurrences.orphaned",
        count: input.orphanOccurrenceCount,
        path: "question_occurrences",
        message: "Question occurrences reference missing papers.",
      },
      {
        code: "question-occurrences.key-missing",
        count: input.missingOccurrenceKeyCount,
        path: "question_occurrences.occurrence_key",
        message: "Question occurrences are missing a stable key.",
      },
      {
        code: "course-items.orphaned",
        count: input.orphanCourseItemCount,
        path: "learning_course_items",
        message: "Course items reference missing modules.",
      },
      {
        code: "plan-steps.orphaned",
        count: input.orphanPlanStepCount,
        path: "study_plan_steps",
        message: "Study plan steps reference missing plans.",
      },
      {
        code: "lesson-sections.blocks-invalid",
        count: input.invalidBlockCount,
        path: "lesson_sections.blocks_json",
        message: "Lesson sections contain invalid editorial block JSON.",
      },
      {
        code: "lesson-sections.role-invalid",
        count: input.invalidRoleCount,
        path: "lesson_sections.pedagogical_role",
        message: "Lesson sections contain an invalid pedagogical role.",
      },
      {
        code: "lessons.progression-incomplete",
        count: input.incompleteLessonCount,
        path: "lessons.pedagogical_progression",
        message: "Published lessons do not contain the complete pedagogical progression.",
      },
      {
        code: "lessons.metadata-invalid",
        count: input.invalidLessonMetadataCount,
        path: "lessons.editorial_metadata",
        message: "Published lessons contain invalid or incomplete editorial metadata.",
      },
      {
        code: "lesson-sources.orphaned",
        count: input.orphanLessonSourceCount,
        path: "lesson_sources",
        message: "Lesson sources reference missing lessons or source documents.",
      },
      {
        code: "lesson-sections.invalid",
        count: input.invalidLessonSectionCount,
        path: "lesson_sections",
        message: "Lesson sections contain invalid content, format, or reading time.",
      },
    ];

    const issues: ContentSnapshotValidationIssue[] = [
      ...missingTables.map((table) => {
        return {
          code: "tables.missing",
          path: `tables.${table}`,
          message: `Required table is missing: ${table}.`,
        };
      }),
      ...countChecks
        .filter((check) => {
          return check.count < 1;
        })
        .map(({ code, path, message }) => {
          return {
            code,
            path,
            message,
          };
        }),
      ...relationChecks
        .filter((check) => {
          return check.count > 0;
        })
        .map(({ code, path, message }) => {
          return {
            code,
            path,
            message,
          };
        }),
    ];

    const summary = {
      tableCount: input.tables.length,
      questionCount: input.questionCount,
      publishedProcessCount: input.publishedProcessCount,
      publishedCourseCount: input.publishedCourseCount,
      assessmentSetCount: input.assessmentSetCount,
      issueCount: issues.length,
      ...(input.curriculumCoverage ? { curriculumCoverage: input.curriculumCoverage } : {}),
    };

    return {
      status: issues.length === 0 ? "valid" : "invalid",
      issues,
      summary,
    };
  }
}
