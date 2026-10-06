import { UIContentGroup } from "@guesant/saberes-ui";
import { FocusEmptyState } from "./focus-empty-state.component";
import { FocusSessionItem } from "./focus-session-item.component";
import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";

export interface FocusSessionListProps {
  sessions: FocusSession[];
}

export function FocusSessionList(props: FocusSessionListProps) {
  const completedSessions = props.sessions.filter((session) => {
    return session.status === FocusSessionStatus.Completed;
  });

  if (!completedSessions.length) {
    return <FocusEmptyState />;
  }

  return (
    <UIContentGroup variant="list">
      {completedSessions
        .map((session) => {
          return <FocusSessionItem key={session.id} session={session} />;
        })}
    </UIContentGroup>
  );
}
