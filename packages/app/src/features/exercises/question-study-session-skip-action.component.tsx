import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface QuestionStudySessionSkipActionProps {
  onSkip: () => Promise<void>;
}

export function QuestionStudySessionSkipAction(props: QuestionStudySessionSkipActionProps) {
  const { t } = useTranslation();

  return (
    <UIButton variant="text" onClick={props.onSkip}>
      {t("exercise.skipQuestion")}
    </UIButton>
  );
}
