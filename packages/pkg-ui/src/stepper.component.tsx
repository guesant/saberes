import { Stepper as MuiStepper, type StepperProps as MuiStepperProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIStepperProps = MuiStepperProps;

export function UIStepper(props: UIStepperProps): ReactElement {
  return <MuiStepper {...props} />;
}
