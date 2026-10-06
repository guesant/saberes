import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AssessmentSessionLauncherFeedback } from "./assessment-session-launcher-feedback.component";
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
        <UIButton disabled={viewModel.pending} variant="contained" onClick={() => { return viewModel.startSession("practice"); }}>
          {t("assessment.start")}
        </UIButton>
        <UIButton disabled={viewModel.pending || !props.assessment.canSimulate} variant="outlined" onClick={() => { return viewModel.startSession("simulation"); }}>
          Começar simulado
        </UIButton>
      </UIInlineActions>
      <UITypography color="text.secondary">
        Prática: correção a cada resposta. Simulado: respostas revisáveis e resultado ao finalizar.
        {props.assessment.canSimulate ? ` Tempo contínuo de ${props.assessment.duration_minutes} minutos, inclusive ao sair da página.` : ` ${props.assessment.readinessReason}`}
      </UITypography>
      <AssessmentSessionLauncherFeedback error={viewModel.error} />
    </UIContentGroup>
  );
}
