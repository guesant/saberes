import { UIContentGroup, UIDisclosure, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { MyStudySessionList } from "./my-study-session-list.component";
import type { StudySession } from "@guesant/saberes-application";

export type MyStudySessionHistoryProps = {
  sessions: StudySession[];
};

export function MyStudySessionHistory(props: MyStudySessionHistoryProps) {
  const { t } = useTranslation();

  if (!props.sessions.length) {
    return null;
  }

  return (
    <UIDisclosure summary={t("home.studySessions")}>
      <UIContentGroup variant="content">
        <UITypography variant="h5">{t("home.studySessions")}</UITypography>
        <MyStudySessionList sessions={props.sessions} />
      </UIContentGroup>
    </UIDisclosure>
  );
}
