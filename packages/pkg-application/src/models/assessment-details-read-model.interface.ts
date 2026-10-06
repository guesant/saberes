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
  readinessReason: string;
}
