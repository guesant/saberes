import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface FocusPauseActionProps {
  active: boolean;
  onPause(): Promise<void>;
}

export function FocusPauseAction(props: FocusPauseActionProps) {
  const { t } = useTranslation();

  if (!props.active) {
    return null;
  }

  return (
    <UIButton onClick={props.onPause} variant="outlined">
      {t("focus.pause")}
    </UIButton>
  );
}
