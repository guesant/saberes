import type { StudySession } from "@guesant/saberes-application";

export interface CreateQuestionStudySessionInput {
  id: string;
  questionKeys: string[];
  startedAt: string;
}

export function createQuestionStudySession(input: CreateQuestionStudySessionInput): StudySession {
  return {
    id: input.id,
    activityType: "question",
    startedAt: input.startedAt,
    questionKeys: input.questionKeys,
    currentIndex: 0,
    status: "active",
    answeredQuestionKeys: [],
    correctAnswers: 0,
  };
}
