export interface QuestionDetailsReadModel {
  training_eligible?: boolean;
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
  answer_status?: "provisional" | "definitive" | "cancelled";
  editorial_status?: string;
  occurrence_status?: string;
  editorial_version?: string;
  answer_key_version?: number | string;
  source_edition_slug?: string;
  source_stage_slug?: string;
  target_edition_slug?: string;
  target_stage_slug?: string;
}
