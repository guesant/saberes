export interface AssessmentDetailsReadModel {
  id: number;
  slug: string;
  title: string;
  description: string;
  kind: string;
  duration_minutes: number;
  is_published: number;
  expected_question_count: number | null;
  canSimulate: boolean;
  canPractice?: boolean;
  practiceQuestionKeys?: string[];
  cancelledQuestionCount?: number;
  cancelledQuestionPolicy?: "award_max_points";
  readinessReason: string;
  stage_id?: number | null;
  paper_id?: number | null;
  paper_version_id?: number | null;
}
