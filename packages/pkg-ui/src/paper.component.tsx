import { Paper as MuiPaper, type PaperProps as MuiPaperProps } from "@mui/material";
import type { ReactElement } from "react";

export type PaperProps = MuiPaperProps;

export function Paper(props: PaperProps): ReactElement {
  return <MuiPaper {...props} />;
}
