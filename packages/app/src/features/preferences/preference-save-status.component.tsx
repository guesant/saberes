import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { PreferenceSaveState } from "./preference-save-state.type";

export interface PreferenceSaveStatusProps {
  state: PreferenceSaveState[keyof PreferenceSaveState];
}

export function PreferenceSaveStatus(props: PreferenceSaveStatusProps) {
  const { t } = useTranslation();

  if (props.state === "idle") {
    return null;
  }

  const error = props.state === "error";

  return (
    <UITypography color={error ? "error" : "text.secondary"} role={error ? "alert" : "status"} variant="body2">
      {error ? t("preferences.saveError") : t("preferences.saving")}
    </UITypography>
  );
}
