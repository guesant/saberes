import MuiBookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIBookmarkBorderIconProps = SvgIconProps;

export function UIBookmarkBorderIcon(props: UIBookmarkBorderIconProps): ReactElement {
  return <MuiBookmarkBorderIcon {...props} />;
}
