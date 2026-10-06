import type { StudySession } from "@guesant/saberes-application";

export function getSimulationDraftAnswer(session: StudySession | null, questionKey: string): string {
  const answer = session?.simulationAnswers?.find((draft) => { return draft.questionKey === questionKey; })?.value;

  return answer || "";
}
