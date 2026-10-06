import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { PreferenceReminderControlProps } from "./preference-reminder-control-props.interface";

export function PreferenceReminderControl(props: PreferenceReminderControlProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions wrap>
      <UIButton aria-pressed={props.value === "yes"} onClick={() => { return props.onChange({ key: "reminders", value: "yes" }); }} variant={props.value === "yes" ? "contained" : "outlined"}>
        {t("preferences.reminderYes")}
      </UIButton>
      <UIButton aria-pressed={props.value === "not-now"} onClick={() => { return props.onChange({ key: "reminders", value: "not-now" }); }} variant={props.value === "not-now" ? "contained" : "outlined"}>
        {t("preferences.reminderNotNow")}
      </UIButton>
      <UIButton aria-pressed={props.value === "never"} onClick={() => { return props.onChange({ key: "reminders", value: "never" }); }} variant={props.value === "never" ? "contained" : "outlined"}>
        {t("preferences.reminderNever")}
      </UIButton>
    </UIInlineActions>
  );
}
