import { UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { GoalItemProgress } from "./goal-item-progress.component";
import { GoalItemStatusActions } from "./goal-item-status-actions.component";
import { GoalItemSummary } from "./goal-item-summary.component";
import type { GoalItemContentProps } from "./goal-item-content-props.interface";

export function GoalItemContent(props: GoalItemContentProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <GoalItemSummary
        details={`${t(`goals.metrics.${props.goal.metric}`)}${props.goal.dueAt ? ` · ${props.goal.dueAt}` : ""} · ${t(`goals.timing.${props.timing}`)}`}
        progress={t("goals.progress", { current: props.goal.current, target: props.goal.target })}
        title={props.goal.title}
      />
      <GoalItemProgress
        current={props.current}
        label={t("goals.currentLabel")}
        onChange={props.onCurrentChange}
        onSave={props.onSaveProgress}
        target={props.goal.target}
        updateLabel={t("goals.updateProgress")}
      />
      <GoalItemStatusActions
        goal={props.goal}
        labels={{
          archive: t("goals.archive"),
          complete: t("goals.complete"),
          pause: t("goals.pause"),
          restore: t("goals.restore"),
          resume: t("goals.resume"),
        }}
        onArchive={props.onArchive}
        onComplete={props.onComplete}
        onPause={props.onPause}
        onRestore={props.onRestore}
        onResume={props.onResume}
      />
    </UIContentGroup>
  );
}
