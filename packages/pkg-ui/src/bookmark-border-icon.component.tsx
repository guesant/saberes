import MuiBookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type BookmarkBorderIconProps = SvgIconProps;

export function BookmarkBorderIcon(props: BookmarkBorderIconProps): ReactElement {
  return <MuiBookmarkBorderIcon {...props} />;
}
