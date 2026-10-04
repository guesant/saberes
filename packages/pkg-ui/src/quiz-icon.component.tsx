import MuiQuizIcon from "@mui/icons-material/Quiz";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIQuizIconProps = SvgIconProps;

export function UIQuizIcon(props: UIQuizIconProps): ReactElement {
  return <MuiQuizIcon {...props} />;
}
