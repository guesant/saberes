import { Step as MuiStep, type StepProps as MuiStepProps } from "@mui/material";
import type { ReactElement } from "react";

export type StepProps = MuiStepProps;

export function Step(props: StepProps): ReactElement {
  return <MuiStep {...props} />;
}
