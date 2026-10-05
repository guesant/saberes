import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { StudyPlanControls } from "./study-plan-controls.component";
import type { StudyPlanCustomizationDisclosureProps } from "./study-plan-customization-disclosure-props.interface";

export interface StudyPlanCustomizationDialogProps extends StudyPlanCustomizationDisclosureProps {
  title: string;
  triggerLabel: string;
}

export function StudyPlanCustomizationDialog(props: StudyPlanCustomizationDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="outlined">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <StudyPlanControls
          onDailyMinutesChange={props.onDailyMinutesChange}
          onStartDateChange={props.onStartDateChange}
          onTargetDateChange={props.onTargetDateChange}
          onTogglePause={props.onTogglePause}
          state={props.state}
        />
      </UIDialog>
    </>
  );
}
