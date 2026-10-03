import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import type { ReactElement } from "react";

export type ButtonProps = MuiButtonProps & {
  href?: string;
  rel?: string;
  target?: string;
  to?: string;
};

export function Button(props: ButtonProps): ReactElement {
  return <MuiButton {...(props as MuiButtonProps)} />;
}
