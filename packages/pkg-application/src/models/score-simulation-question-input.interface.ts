import type { QuestionReadModel } from "./question-read-model.model";
import type { StudySession } from "./study-session.interface";

export interface ScoreSimulationQuestionInput {
  session: StudySession;
  questionKey: string;
  data: QuestionReadModel;
}
