import { Step as MuiStep, type StepProps as MuiStepProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIStepProps = MuiStepProps;

export function UIStep(props: UIStepProps): ReactElement {
  return <MuiStep {...props} />;
}
