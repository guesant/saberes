export interface CreatePreferenceOptionDataInput {
  recommendations: boolean;
  gamification: boolean;
  richContent: boolean;
  reminders: boolean;
  translate(key: string): string;
}
