import { StudyGoalStatus } from "@guesant/saberes-application";
import { createGoalItemStatusAction } from "./create-goal-item-status-action.function";
import type { CreateGoalItemStatusActionInput } from "./create-goal-item-status-action-input.interface";
import type { GoalItemStatusActionsProps } from "./goal-item-status-actions-props.interface";
import type { GoalItemStatusButtonProps } from "./goal-item-status-button-props.interface";

export function createGoalItemStatusActions(
  value: GoalItemStatusActionsProps,
): GoalItemStatusButtonProps[] {
  const { status } = value.goal;

  const isActive = status === StudyGoalStatus.Active;

  const isPaused = status === StudyGoalStatus.Paused;

  const isArchived = status === StudyGoalStatus.Archived;

  return [
    createGoalItemStatusAction({
      hidden: !isActive,
      label: value.labels.pause,
      onClick: () => value.onPause(value.goal.contentKey),
    } satisfies CreateGoalItemStatusActionInput),
    createGoalItemStatusAction({
      hidden: !isPaused,
      label: value.labels.resume,
      onClick: () => value.onResume(value.goal.contentKey),
    } satisfies CreateGoalItemStatusActionInput),
    createGoalItemStatusAction({
      hidden: status === StudyGoalStatus.Completed || isArchived,
      label: value.labels.complete,
      onClick: () => value.onComplete(value.goal.contentKey),
    } satisfies CreateGoalItemStatusActionInput),
    createGoalItemStatusAction({
      hidden: isArchived,
      label: value.labels.archive,
      onClick: () => value.onArchive(value.goal.contentKey),
    } satisfies CreateGoalItemStatusActionInput),
    createGoalItemStatusAction({
      hidden: !isArchived,
      label: value.labels.restore,
      onClick: () => value.onRestore(value.goal.contentKey),
    } satisfies CreateGoalItemStatusActionInput),
  ];
}
