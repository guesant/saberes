import { UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { StudyPlanControls } from "./study-plan-controls.component";
import type { StudyPlanCustomizationDisclosureProps } from "./study-plan-customization-disclosure-props.interface";

export function StudyPlanCustomizationDisclosure(props: StudyPlanCustomizationDisclosureProps) {
  const { t } = useTranslation();

  return (
    <UIDisclosure summary={t("plan.customize")}>
      <StudyPlanControls
        state={props.state}
        onTogglePause={props.onTogglePause}
        onStartDateChange={props.onStartDateChange}
        onTargetDateChange={props.onTargetDateChange}
        onDailyMinutesChange={props.onDailyMinutesChange}
      />
    </UIDisclosure>
  );
}
