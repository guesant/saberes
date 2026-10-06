import type { QuestionReadModel, StudySession } from "@guesant/saberes-application";

export interface SimulationSessionQueriesViewModel {
  session: StudySession | null;
  question: QuestionReadModel | null;
  questionKey: string;
  loading: boolean;
  error: Error | null;
  reload(): Promise<void>;
}
