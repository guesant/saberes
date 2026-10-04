import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type MyStudySessionResumeActionProps = {
  onResume: () => void;
};

export function MyStudySessionResumeAction(props: MyStudySessionResumeActionProps) {
  const { t } = useTranslation();

  return (
    <UIButton onClick={props.onResume} size="small" variant="outlined">
      {t("home.resumeSession")}
    </UIButton>
  );
}
