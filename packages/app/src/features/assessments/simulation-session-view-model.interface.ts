import type { QuestionReadModel, StudySession } from "@guesant/saberes-application";

export interface SimulationSessionViewModel {
  session: StudySession | null;
  question: QuestionReadModel | null;
  questionKey: string;
  loading: boolean;
  busy: boolean;
  finishing: boolean;
  expired: boolean;
  remainingSeconds: number | null;
  answer: string;
  error: string | null;
  contentError: Error | null;
  confirmed: boolean;
  changeAnswer(value: string): void;

  retryAnswer(): Promise<void>;

  toggleFlag(): Promise<void>;

  navigate(index: number): Promise<void>;

  requestFinish(): void;

  cancelFinish(): void;

  finish(): Promise<void>;

  reload(): Promise<void>;
}
