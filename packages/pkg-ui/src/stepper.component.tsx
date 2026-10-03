import { Stepper as MuiStepper, type StepperProps as MuiStepperProps } from "@mui/material";
import type { ReactElement } from "react";

export type StepperProps = MuiStepperProps;

export function Stepper(props: StepperProps): ReactElement {
  return <MuiStepper {...props} />;
}
