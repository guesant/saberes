import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AssessmentItemsView } from "./assessment-items-view.component";
import { AssessmentProgressError } from "./assessment-progress-error.component";
import { AssessmentProgressSummary } from "./assessment-progress-summary.component";
import type { AssessmentReadyViewProps } from "./assessment-ready-view-props.type";

export function AssessmentReadyView(props: AssessmentReadyViewProps) {
  const { t } = useTranslation();

  const title = String(props.data.assessment.title || t("assessment.practice"));

  const description = String(props.data.assessment.description || "");

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="tight">
        <UITypography variant="overline">{t("assessment.practice")}</UITypography>
        <UITypography variant="h2">{title}</UITypography>
        <UITypography color="text.secondary">{description}</UITypography>
      </UIContentGroup>

      {props.progress ? <AssessmentProgressSummary progress={props.progress} /> : null}

      {props.progressError ? (
        <AssessmentProgressError error={props.progressError} onRetry={props.onReloadProgress} />
      ) : null}

      <UICard>
        <UICardContent>
          <UITypography variant="h5">{t("assessment.questions")}</UITypography>
          <AssessmentItemsView items={props.data.items} />
        </UICardContent>
      </UICard>
    </UIContentGroup>
  );
}
