import type { StudySession } from "@guesant/saberes-application";

export function canResumeStudySession(session: StudySession): boolean {
  const resumableActivities: StudySession["activityType"][] = ["question", "assessment", "review"];

  return (
    resumableActivities.includes(session.activityType) &&
    session.status !== "completed" &&
    Boolean(session.questionKeys?.length)
  );
}
