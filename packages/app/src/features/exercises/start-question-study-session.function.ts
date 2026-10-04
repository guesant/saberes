import { createQuestionStudySession } from "./create-question-study-session.function";
import type { CatalogCard, ApplicationServices, StudySession } from "@guesant/saberes-application";

export interface StartQuestionStudySessionInput {
  navigate: (path: string) => void;
  questions: CatalogCard[];
  quantity: string;
  services: ApplicationServices;
}

export async function startQuestionStudySession(
  input: StartQuestionStudySessionInput,
): Promise<void> {
  const selectedQuantity = Math.max(
    1,
    Math.min(Number(input.quantity) || 1, input.questions.length),
  );

  const questionKeys = input.questions
    .slice(0, selectedQuantity)
    .map((question) => `question:${String(question.id)}`);

  const session: StudySession = createQuestionStudySession({
    id: input.services.platform.ids.execute(),
    questionKeys,
    startedAt: new Date().toISOString(),
  });

  await input.services.progress.saveSession.execute(session);

  input.navigate(`/sessoes/questoes/${session.id}`);
}
