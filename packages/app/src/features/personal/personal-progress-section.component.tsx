import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalProgressStateView } from "./personal-progress-state-view.component";
import type { PersonalProgressSectionProps } from "./personal-progress-section-props.interface";

export function PersonalProgressSection(props: PersonalProgressSectionProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">{t("personal.progress.title")}</UITypography>
      <UITypography color="text.secondary">
        {t("personal.progress.description")}
      </UITypography>
      <PersonalProgressStateView progress={props.progress} />
    </UIContentGroup>
  );
}
