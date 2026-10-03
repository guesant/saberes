import MuiArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type ArrowForwardIconProps = SvgIconProps;

export function ArrowForwardIcon(props: ArrowForwardIconProps): ReactElement {
  return <MuiArrowForwardIcon {...props} />;
}
