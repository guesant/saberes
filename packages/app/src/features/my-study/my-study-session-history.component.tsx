import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { MyStudyNoSessions } from "./my-study-no-sessions.component";
import { MyStudySessionList } from "./my-study-session-list.component";
import type { StudySession } from "@guesant/saberes-application";

export type MyStudySessionHistoryProps = {
  sessions: StudySession[];
};

export function MyStudySessionHistory(props: MyStudySessionHistoryProps) {
  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">{t("home.studySessions")}</UITypography>
          {props.sessions.length ? (
            <MyStudySessionList sessions={props.sessions} />
          ) : (
            <MyStudyNoSessions />
          )}
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
