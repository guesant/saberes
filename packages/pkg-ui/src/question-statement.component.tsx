import { Typography as MuiTypography } from "@mui/material";
import type { TypographyProps as MuiTypographyProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIQuestionStatementProps = Omit<MuiTypographyProps, "children"> & {
  children: string;
};

export function UIQuestionStatement(props: UIQuestionStatementProps): ReactElement {
  return <MuiTypography {...props} sx={{ whiteSpace: "pre-wrap", ...props.sx }} />;
}
