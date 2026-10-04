import MuiAutoStoriesIcon from "@mui/icons-material/AutoStories";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIAutoStoriesIconProps = SvgIconProps;

export function UIAutoStoriesIcon(props: UIAutoStoriesIconProps): ReactElement {
  return <MuiAutoStoriesIcon {...props} />;
}
