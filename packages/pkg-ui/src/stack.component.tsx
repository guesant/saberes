import { Stack as MuiStack, type StackProps as MuiStackProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIStackProps = MuiStackProps;

export function UIStack(props: UIStackProps): ReactElement {
  return <MuiStack {...props} />;
}
