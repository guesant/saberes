import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface FocusResumeActionProps {
  active: boolean;
  onResume(): Promise<void>;
  paused: boolean;
}

export function FocusResumeAction(props: FocusResumeActionProps) {
  const { t } = useTranslation();

  const visible = !props.active && props.paused;

  return (
    <UIButton disabled={!visible} hidden={!visible} onClick={props.onResume} variant="contained">
      {t("focus.resume")}
    </UIButton>
  );
}
