import MuiPlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type PlayArrowIconProps = SvgIconProps;

export function PlayArrowIcon(props: PlayArrowIconProps): ReactElement {
  return <MuiPlayArrowIcon {...props} />;
}
