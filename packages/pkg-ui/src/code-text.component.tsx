import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UICodeTextProps = {
  children: ReactNode;
};

export function UICodeText(props: UICodeTextProps): ReactElement {
  return <MuiBox component="code">{props.children}</MuiBox>;
}
