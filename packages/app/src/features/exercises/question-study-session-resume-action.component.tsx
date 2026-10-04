import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type QuestionStudySessionResumeActionProps = { onResume(): Promise<void> };

export function QuestionStudySessionResumeAction(props: QuestionStudySessionResumeActionProps) {
  const { t } = useTranslation();

  return (
    <UIButton variant="contained" onClick={props.onResume}>
      {t("exercise.resumeSession")}
    </UIButton>
  );
}
