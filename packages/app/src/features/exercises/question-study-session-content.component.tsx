import { SimulationSessionView } from "../assessments/simulation-session-view.component";
import { PracticeQuestionStudySessionView } from "./practice-question-study-session-view.component";
import type { QuestionStudySessionContentProps } from "./question-study-session-content-props.interface";

export function QuestionStudySessionContent(props: QuestionStudySessionContentProps) {
  if (props.mode === "simulation") {
    return <SimulationSessionView sessionId={props.sessionId} />;
  }

  return <PracticeQuestionStudySessionView sessionId={props.sessionId} />;
}
