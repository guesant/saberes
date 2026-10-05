import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { PersonalProgressSummaryProps } from "./personal-progress-summary-props.interface";

export function PersonalProgressSummary(props: PersonalProgressSummaryProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography>
        {t("personal.progress.links", { count: props.data.links.length })}
      </UITypography>
      <UITypography>
        {t("personal.progress.unlinkedSessions", {
          count: props.data.unlinkedSessionIds.length,
        })}
      </UITypography>
      <UITypography>
        {t("personal.progress.unlinkedAttempts", {
          count: props.data.unlinkedAttemptIds.length,
        })}
      </UITypography>
      <UITypography>
        {t("personal.progress.unlinkedActivities", {
          count: props.data.unlinkedActivityIds.length,
        })}
      </UITypography>
    </UIContentGroup>
  );
}
