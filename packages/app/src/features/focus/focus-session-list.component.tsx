import { UIContentGroup } from "@guesant/saberes-ui";
import { FocusEmptyState } from "./focus-empty-state.component";
import { FocusSessionItem } from "./focus-session-item.component";
import type { FocusSession } from "@guesant/saberes-application";

export interface FocusSessionListProps {
  sessions: FocusSession[];
}

export function FocusSessionList(props: FocusSessionListProps) {
  if (!props.sessions.length) {
    return <FocusEmptyState />;
  }

  return (
    <UIContentGroup variant="list">
      {props.sessions.slice(0, 5)
        .map((session) => {
          return <FocusSessionItem key={session.id} session={session} />;
        })}
    </UIContentGroup>
  );
}
