import { UISelectableSurface } from "@guesant/saberes-ui";
import { useState } from "react";
import { getStudyGoalTiming } from "./get-study-goal-timing.function";
import { GoalItemContent } from "./goal-item-content.component";
import type { GoalItemProps } from "./goal-item-props.interface";
import type { StudyGoalTiming } from "./study-goal-timing.type";

export function GoalItem(props: GoalItemProps) {
  const [current, setCurrent] = useState(String(props.goal.current));

  const timing: StudyGoalTiming = getStudyGoalTiming(props.goal, new Date());

  const saveProgress = async (): Promise<void> => {
    await props.onUpdateProgress(props.goal.contentKey, Number(current) || 0);
  };

  return (
    <UISelectableSurface id={`goal-${encodeURIComponent(props.goal.contentKey)}`} selected={false}>
      <GoalItemContent
        current={current}
        goal={props.goal}
        onCurrentChange={setCurrent}
        onArchive={props.onArchive}
        onPause={props.onPause}
        onResume={props.onResume}
        onComplete={props.onComplete}
        onRestore={props.onRestore}
        onUpdateProgress={props.onUpdateProgress}
        onSaveProgress={saveProgress}
        timing={timing}
      />
    </UISelectableSurface>
  );
}
