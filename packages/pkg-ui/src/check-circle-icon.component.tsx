import MuiCheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type CheckCircleIconProps = SvgIconProps;

export function CheckCircleIcon(props: CheckCircleIconProps): ReactElement {
  return <MuiCheckCircleIcon {...props} />;
}
