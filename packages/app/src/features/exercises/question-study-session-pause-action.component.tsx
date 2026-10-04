import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type QuestionStudySessionPauseActionProps = {
  onPause: () => Promise<void>;
};

export function QuestionStudySessionPauseAction(props: QuestionStudySessionPauseActionProps) {
  const { t } = useTranslation();

  return (
    <UIButton variant="outlined" onClick={props.onPause}>
      {t("exercise.pauseSession")}
    </UIButton>
  );
}
