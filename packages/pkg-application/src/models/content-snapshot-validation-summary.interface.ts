import type { CurriculumCoverageReport } from "./curriculum-coverage-report.interface";

export interface ContentSnapshotValidationSummary {
  tableCount: number;
  questionCount: number;
  publishedProcessCount: number;
  publishedCourseCount: number;
  assessmentSetCount: number;
  issueCount: number;
  curriculumCoverage?: CurriculumCoverageReport[];
}
