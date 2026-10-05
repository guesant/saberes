export interface QuestionSubmitActionProps {
  answer: string | null;
  confidence: boolean;
  onSubmit(): Promise<void>;
  submitting: boolean;
}
