import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface FocusStopActionProps {
  active: boolean;
  onStop(): Promise<void>;
  paused: boolean;
}

export function FocusStopAction(props: FocusStopActionProps) {
  const { t } = useTranslation();

  const visible = props.active || props.paused;

  return (
    <UIButton disabled={!visible} hidden={!visible} onClick={props.onStop} variant="outlined">
      {t("focus.stop")}
    </UIButton>
  );
}
