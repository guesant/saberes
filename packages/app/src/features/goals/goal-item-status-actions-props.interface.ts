import type { StudyGoal } from "@guesant/saberes-application";

export interface GoalItemStatusActionsProps {
  goal: StudyGoal;

  labels: Record<string, string>;

  onArchive(contentKey: string): Promise<void>;

  onComplete(contentKey: string): Promise<void>;

  onPause(contentKey: string): Promise<void>;

  onRestore(contentKey: string): Promise<void>;

  onResume(contentKey: string): Promise<void>;
}
