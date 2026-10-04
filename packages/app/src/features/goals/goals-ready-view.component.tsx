import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { GoalForm } from "./goal-form.component";
import { GoalList } from "./goal-list.component";
import { GoalSaveError } from "./goal-save-error.component";
import type { UseStudyGoalsViewModel } from "./study-goals.view-model";

export interface GoalsReadyViewProps {
  viewModel: UseStudyGoalsViewModel;
}

export function GoalsReadyView(props: GoalsReadyViewProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="tight">
        <UITypography variant="overline">{t("goals.eyebrow")}</UITypography>
        <UITypography variant="h2">{t("goals.title")}</UITypography>
        <UITypography color="text.secondary">{t("goals.description")}</UITypography>
      </UIContentGroup>
      <GoalForm
        existingTitles={props.viewModel.goals.map((goal) => {
          return goal.title;
        })}
        onCreate={props.viewModel.create}
      />
      <GoalSaveError error={props.viewModel.saveError} />
      <GoalList
        goals={props.viewModel.goals}
        onArchive={props.viewModel.archive}
        onComplete={props.viewModel.complete}
        onPause={props.viewModel.pause}
        onResume={props.viewModel.resume}
        onRestore={props.viewModel.restore}
        onUpdateProgress={props.viewModel.updateProgress}
      />
    </UIContentGroup>
  );
}
