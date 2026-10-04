import {
  UIButton,
  UIContentGroup,
  UIInlineActions,
  UITextField,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { StudyPlanControlsProps } from "./study-plan-controls-props.type";

export function StudyPlanControls(props: StudyPlanControlsProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h6">{t("plan.localCopyTitle")}</UITypography>
      <UITypography color="text.secondary">{t(`plan.status.${props.state.status}`)}</UITypography>
      <UIInlineActions wrap>
        <UIButton variant="outlined" onClick={props.onTogglePause}>
          {t(props.state.status === "paused" ? "plan.resume" : "plan.pause")}
        </UIButton>
        <UITextField
          label={t("plan.startDate")}
          type="date"
          value={props.state.startDate}
          onChange={(event) => { return props.onStartDateChange(event.target.value); }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <UITextField
          label={t("plan.targetDate")}
          type="date"
          value={props.state.targetDate}
          onChange={(event) => { return props.onTargetDateChange(event.target.value); }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <UITextField
          label={t("plan.dailyMinutes")}
          type="number"
          value={props.state.dailyMinutes}
          onChange={(event) => { return props.onDailyMinutesChange(Number(event.target.value)); }}
          inputProps={{ min: 1, max: 480 }}
        />
      </UIInlineActions>
    </UIContentGroup>
  );
}
