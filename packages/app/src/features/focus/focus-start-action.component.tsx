import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface FocusStartActionProps {
  active: boolean;
  onStart(): Promise<void>;
  paused: boolean;
}

export function FocusStartAction(props: FocusStartActionProps) {
  const { t } = useTranslation();

  if (props.active || props.paused) {
    return null;
  }

  return (
    <UIButton onClick={props.onStart} variant="contained">
      {t("focus.start")}
    </UIButton>
  );
}
