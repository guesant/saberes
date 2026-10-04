import { UIAlert, UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { AssessmentProgressErrorProps } from "./assessment-progress-error-props.type";

export function AssessmentProgressError(props: AssessmentProgressErrorProps) {
  const { t } = useTranslation();

  return (
    <UIAlert severity="warning">
      <UIContentGroup variant="tight">
        {t("assessment.progressError", { message: props.error.message })}
        <UIButton onClick={() => props.onRetry()} size="small">
          {t("common.retry")}
        </UIButton>
      </UIContentGroup>
    </UIAlert>
  );
}
