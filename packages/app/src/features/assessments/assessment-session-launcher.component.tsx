import { UIChoiceButton, UIContentGroup, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AssessmentSessionLauncherFeedback } from "./assessment-session-launcher-feedback.component";
import { AssessmentTrainingAvailability } from "./assessment-training-availability.component";
import { useAssessmentSessionLauncher } from "./use-assessment-session-launcher.hook";
import type { AssessmentSessionLauncherProps } from "./assessment-session-launcher-props.interface";

export function AssessmentSessionLauncher(props: AssessmentSessionLauncherProps) {
  const { t } = useTranslation();

  const viewModel = useAssessmentSessionLauncher(props);

  if (!viewModel.questionKeys.length) {
    return null;
  }

  return (
    <UIContentGroup variant="content">
      <UIInlineActions wrap>
        <UIChoiceButton disabled={viewModel.pending || props.assessment.canPractice === false} variant="contained" onClick={() => { return viewModel.startSession("practice"); }}>
          {t("assessment.practiceQuestions")}
        </UIChoiceButton>
        <UIChoiceButton disabled={viewModel.pending || !props.assessment.canSimulate} variant="outlined" onClick={() => { return viewModel.startSession("simulation"); }}>
          {t("simulator.start")}
        </UIChoiceButton>
      </UIInlineActions>
      <AssessmentTrainingAvailability assessment={props.assessment} />
      <AssessmentSessionLauncherFeedback error={viewModel.error} />
    </UIContentGroup>
  );
}
