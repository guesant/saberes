import type { CurriculumCoverageReport } from "./curriculum-coverage-report.interface";

export interface ContentSnapshotValidationInput {
  tables: string[];
  questionCount: number;
  publishedProcessCount: number;
  publishedCourseCount: number;
  assessmentSetCount: number;
  orphanOccurrenceCount: number;
  missingOccurrenceKeyCount: number;
  orphanCourseItemCount: number;
  orphanPlanStepCount: number;
  invalidBlockCount: number;
  invalidRoleCount: number;
  incompleteLessonCount: number;
  invalidLessonMetadataCount: number;
  orphanLessonSourceCount: number;
  invalidLessonSectionCount: number;
  curriculumCoverage?: CurriculumCoverageReport[];
}
