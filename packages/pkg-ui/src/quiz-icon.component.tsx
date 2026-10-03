import MuiQuizIcon from "@mui/icons-material/Quiz";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type QuizIconProps = SvgIconProps;

export function QuizIcon(props: QuizIconProps): ReactElement {
  return <MuiQuizIcon {...props} />;
}
