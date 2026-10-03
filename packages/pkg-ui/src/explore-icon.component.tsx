import MuiExploreIcon from "@mui/icons-material/Explore";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type ExploreIconProps = SvgIconProps;

export function ExploreIcon(props: ExploreIconProps): ReactElement {
  return <MuiExploreIcon {...props} />;
}
