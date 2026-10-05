import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface FocusStopActionProps {
  active: boolean;
  onStop(): Promise<void>;
  paused: boolean;
}

export function FocusStopAction(props: FocusStopActionProps) {
  const { t } = useTranslation();

  if (!props.active && !props.paused) {
    return null;
  }

  return (
    <UIButton onClick={props.onStop} variant="outlined">
      {t("focus.stop")}
    </UIButton>
  );
}
