import { MyStudySessionItem } from "./my-study-session-item.component";
import type { StudySession } from "@guesant/saberes-application";

export type MyStudySessionListProps = {
  sessions: StudySession[];
};

export function MyStudySessionList(props: MyStudySessionListProps) {
  const sessions = [...props.sessions]
    .sort((left, right) => {
      return String(right.startedAt)
        .localeCompare(String(left.startedAt));
    })
    .slice(0, 5);

  return sessions.map((session) => {
    return <MyStudySessionItem key={session.id} session={session} />;
  });
}
