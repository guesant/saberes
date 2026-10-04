import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UISectionAnchorProps = {
  children: ReactNode;
  id: string;
};

export function UISectionAnchor(props: UISectionAnchorProps): ReactElement {
  return <MuiBox id={props.id}>{props.children}</MuiBox>;
}
