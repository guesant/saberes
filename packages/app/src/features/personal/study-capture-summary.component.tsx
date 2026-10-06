import { getContentReferenceKey } from "@guesant/saberes-application";
import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalRelatedContent } from "./personal-related-content.component";
import type { StudyCapture } from "@guesant/saberes-application";

export interface StudyCaptureSummaryProps {
  capture: StudyCapture;
}

export function StudyCaptureSummary(props: StudyCaptureSummaryProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h6">{props.capture.title}</UITypography>
      <UITypography color="text.secondary">{props.capture.description}</UITypography>
      {getContentReferenceKey(props.capture.contentReference) ? (
        <PersonalRelatedContent value={getContentReferenceKey(props.capture.contentReference) || ""} />
      ) : null}
      <UITypography color="text.secondary">
        {props.capture.dueDate
          ? t("personal.dueDateValue", { value: props.capture.dueDate })
          : t("personal.noDueDate")}
      </UITypography>
    </UIContentGroup>
  );
}
