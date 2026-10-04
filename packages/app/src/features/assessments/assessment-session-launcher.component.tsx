import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getAssessmentQuestionKeys } from "./get-assessment-question-keys.function";
import { startAssessmentStudySession } from "./start-assessment-study-session.function";

export interface AssessmentSessionLauncherProps {
  assessmentKey: string;
  items: Array<Record<string, unknown>>;
}

export function AssessmentSessionLauncher(props: AssessmentSessionLauncherProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const services = useAppServices();

  const questionKeys = getAssessmentQuestionKeys(props.items);

  if (!questionKeys.length) {
    return null;
  }

  return (
    <UIButton
      variant="contained"
      onClick={() =>
        startAssessmentStudySession({
          assessmentKey: props.assessmentKey,
          navigate,
          questionKeys,
          services,
        })
      }
    >
      {t("assessment.start")}
    </UIButton>
  );
}
