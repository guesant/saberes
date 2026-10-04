import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import type { ReactElement } from "react";

export interface UIButtonProps extends MuiButtonProps {
  href?: string;
  rel?: string;
  target?: string;
  to?: string;
}

export function UIButton(props: UIButtonProps): ReactElement {
  return <MuiButton {...(props as MuiButtonProps)} />;
}
