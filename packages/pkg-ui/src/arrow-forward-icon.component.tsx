import MuiArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIArrowForwardIconProps = SvgIconProps;

export function UIArrowForwardIcon(props: UIArrowForwardIconProps): ReactElement {
  return <MuiArrowForwardIcon {...props} />;
}
