import MuiCheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UICheckCircleIconProps = SvgIconProps;

export function UICheckCircleIcon(props: UICheckCircleIconProps): ReactElement {
  return <MuiCheckCircleIcon {...props} />;
}
