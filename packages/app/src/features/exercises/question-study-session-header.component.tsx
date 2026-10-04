import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { QuestionStudySessionPauseAction } from "./question-study-session-pause-action.component";
import { QuestionStudySessionResumeAction } from "./question-study-session-resume-action.component";
import { QuestionStudySessionTimeRemaining } from "./question-study-session-time-remaining.component";
import type { QuestionSessionProgress } from "./get-question-session-progress.function";

export type QuestionStudySessionHeaderProps = {
  progress: QuestionSessionProgress;
  status: "active" | "paused";
  onPause(): Promise<void>;

  onResume(): Promise<void>;
  remainingSeconds?: number | null;
};

export function QuestionStudySessionHeader(props: QuestionStudySessionHeaderProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h4">{t("exercise.sessionTitle")}</UITypography>
      <UITypography>
        {t("exercise.sessionProgress", {
          answered: props.progress.answered,
          total: props.progress.total,
        })}
      </UITypography>
      {props.remainingSeconds !== null && props.remainingSeconds !== undefined ? (
        <QuestionStudySessionTimeRemaining seconds={props.remainingSeconds} />
      ) : null}
      {props.status === "active" ? (
        <QuestionStudySessionPauseAction onPause={props.onPause} />
      ) : (
        <QuestionStudySessionResumeAction onResume={props.onResume} />
      )}
    </UIContentGroup>
  );
}
