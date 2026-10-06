export interface QuestionDetailsReadModel {
  occurrence_id?: number | null;
  occurrence_key?: string;
  question_id?: number;
  question_slug?: string;
  canonical_key?: string;
  type?: string;
  statement?: string;
  explanation?: string;
  difficulty?: string;
  number?: number | null;
  year?: number | null;
  process_name?: string;
  subject?: string;
  image_path?: string;
  correct_answer?: string;
  is_automatically_gradable?: boolean;
}
