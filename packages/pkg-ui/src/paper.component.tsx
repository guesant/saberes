import { Paper as MuiPaper, type PaperProps as MuiPaperProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIPaperProps = MuiPaperProps;

export function UIPaper(props: UIPaperProps): ReactElement {
  return <MuiPaper {...props} />;
}
