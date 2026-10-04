import type { StudySession } from "@guesant/saberes-application";

export interface GetQuestionSessionSkippedKeysInput {
  questionKey: string;
  session: StudySession;
  skipped: boolean | undefined;
}

export function getQuestionSessionSkippedKeys(input: GetQuestionSessionSkippedKeysInput): string[] {
  const currentKeys = input.session.skippedQuestionKeys || [];

  if (!input.skipped) {
    return currentKeys;
  }

  return Array.from(new Set([...currentKeys, input.questionKey]));
}
