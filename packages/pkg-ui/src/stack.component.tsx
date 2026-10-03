import { Stack as MuiStack, type StackProps as MuiStackProps } from "@mui/material";
import type { ReactElement } from "react";

export type StackProps = MuiStackProps;

export function Stack(props: StackProps): ReactElement {
  return <MuiStack {...props} />;
}
