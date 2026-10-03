import MuiAutoStoriesIcon from "@mui/icons-material/AutoStories";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type AutoStoriesIconProps = SvgIconProps;

export function AutoStoriesIcon(props: AutoStoriesIconProps): ReactElement {
  return <MuiAutoStoriesIcon {...props} />;
}
