import MuiCheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UICheckCircleOutlineIconProps = SvgIconProps;

export function UICheckCircleOutlineIcon(props: UICheckCircleOutlineIconProps): ReactElement {
  return <MuiCheckCircleOutlineIcon {...props} />;
}
