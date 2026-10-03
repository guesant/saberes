export interface QuestionLinkBlock {
  type: "question_link";
  questionId: string | number;
  title?: string;
  description?: string;
}
