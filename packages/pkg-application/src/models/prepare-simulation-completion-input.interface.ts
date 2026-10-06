import type { StudySession } from "./study-session.interface";
import type { GetQuestionPort } from "../ports/get-question-port.port";

export interface PrepareSimulationCompletionInput {
  session: StudySession;
  questionKeys: string[];
  getQuestion: GetQuestionPort;
  completedAt: string;
}
