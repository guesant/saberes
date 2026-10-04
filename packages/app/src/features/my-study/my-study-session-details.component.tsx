import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { formatStudySessionStartedAt } from "./format-study-session-started-at.function";
import { getStudySessionDurationMinutes } from "./get-study-session-duration-minutes.function";
import { getStudySessionProgressText } from "./get-study-session-progress-text.function";
import type { StudySession } from "@guesant/saberes-application";

export type MyStudySessionDetailsProps = {
  session: StudySession;
};

export function MyStudySessionDetails(props: MyStudySessionDetailsProps) {
  const { t } = useTranslation();

  const activityType = props.session.activityType || "lesson";

  const status = props.session.status || "completed";

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="body2">{t(`home.sessionType.${activityType}`)}</UITypography>
      <UITypography color="text.secondary" variant="caption">
        {formatStudySessionStartedAt(props.session.startedAt, t("common.now"))} ·{" "}
        {getStudySessionDurationMinutes(props.session)} {t("common.min")}
      </UITypography>
      <UITypography color="text.secondary" variant="caption">
        {t(`home.sessionStatus.${status}`)}
        {getStudySessionProgressText(props.session)}
      </UITypography>
    </UIContentGroup>
  );
}
