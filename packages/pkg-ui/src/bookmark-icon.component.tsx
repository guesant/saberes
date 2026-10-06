import MuiBookmarkIcon from "@mui/icons-material/Bookmark";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIBookmarkIconProps = SvgIconProps;

export function UIBookmarkIcon(props: UIBookmarkIconProps): ReactElement {
  return <MuiBookmarkIcon {...props} />;
}
