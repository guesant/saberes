import type {
  Attempt,
  PersonalActivity,
  StudyGoal,
  StudySession,
} from "@guesant/saberes-application";

export interface CreatePersonalProgressReadModelInput {
  sessions: StudySession[];
  attempts: Attempt[];
  goals: StudyGoal[];
  activities: PersonalActivity[];
}
