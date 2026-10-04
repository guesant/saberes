import {
  StepButton as MuiStepButton,
  type StepButtonProps as MuiStepButtonProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UIStepButtonProps = MuiStepButtonProps;

export function UIStepButton(props: UIStepButtonProps): ReactElement {
  return <MuiStepButton {...props} />;
}
