export interface QuestionSubmitActionProps {
  answer: string | null;
  onSubmit(): void;
  submitting: boolean;
}
