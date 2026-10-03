import {
  StepButton as MuiStepButton,
  type StepButtonProps as MuiStepButtonProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type StepButtonProps = MuiStepButtonProps;

export function StepButton(props: StepButtonProps): ReactElement {
  return <MuiStepButton {...props} />;
}
