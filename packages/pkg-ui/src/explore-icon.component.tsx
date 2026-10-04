import MuiExploreIcon from "@mui/icons-material/Explore";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIExploreIconProps = SvgIconProps;

export function UIExploreIcon(props: UIExploreIconProps): ReactElement {
  return <MuiExploreIcon {...props} />;
}
