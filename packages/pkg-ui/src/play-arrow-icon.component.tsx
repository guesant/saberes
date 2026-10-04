import MuiPlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIPlayArrowIconProps = SvgIconProps;

export function UIPlayArrowIcon(props: UIPlayArrowIconProps): ReactElement {
  return <MuiPlayArrowIcon {...props} />;
}
