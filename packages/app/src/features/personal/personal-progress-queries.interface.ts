import type { Attempt, StudyGoal, StudySession } from "@guesant/saberes-application";

export interface PersonalProgressQueries {
  attempts: Attempt[] | undefined;
  sessions: StudySession[] | undefined;
  goals: StudyGoal[] | undefined;
  isPending: boolean;
  error: Error | null;
  reload(): Promise<void>;
}
