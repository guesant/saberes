import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getStudyPlanDescription } from "./get-study-plan-description.function";
import type { StudyPlanReadModel } from "@guesant/saberes-application";

export type StudyPlanReadyHeaderProps = {
  data: StudyPlanReadModel;
};

export function StudyPlanReadyHeader(props: StudyPlanReadyHeaderProps) {
  const { t } = useTranslation();

  return (
    <>
      <UITypography variant="overline">{t("plan.eyebrow")}</UITypography>
      <UITypography variant="h3">{String(props.data.plan?.title)}</UITypography>
      <UITypography color="text.secondary">{getStudyPlanDescription(props.data)}</UITypography>
    </>
  );
}
