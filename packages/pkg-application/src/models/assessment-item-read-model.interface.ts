export interface AssessmentItemReadModel {
  position: number;
  item_type?: string;
  question_occurrence_id?: number | null;
  question_id?: number | null;
  question_slug?: string;
  lesson_id?: number | null;
  questionKey?: string;
  href?: string;
  max_points?: number;
  title?: string;
  description?: string;
}
