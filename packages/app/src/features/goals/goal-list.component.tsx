import { UIContentGroup } from "@guesant/saberes-ui";
import { GoalEmptyState } from "./goal-empty-state.component";
import { GoalItem } from "./goal-item.component";
import type { StudyGoal } from "@guesant/saberes-application";

export interface GoalListProps {
  goals: StudyGoal[];
  onArchive(contentKey: string): Promise<void>;

  onPause(contentKey: string): Promise<void>;

  onResume(contentKey: string): Promise<void>;

  onComplete(contentKey: string): Promise<void>;

  onRestore(contentKey: string): Promise<void>;

  onUpdateProgress(contentKey: string, current: number): Promise<void>;
}

export function GoalList(props: GoalListProps) {
  if (!props.goals.length) {
    return <GoalEmptyState />;
  }

  return (
    <UIContentGroup variant="list">
      {props.goals.map((goal) => (
        <GoalItem
          goal={goal}
          onArchive={props.onArchive}
          key={goal.contentKey}
          onComplete={props.onComplete}
          onPause={props.onPause}
          onResume={props.onResume}
          onRestore={props.onRestore}
          onUpdateProgress={props.onUpdateProgress}
        />
      ))}
    </UIContentGroup>
  );
}
