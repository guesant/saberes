import MuiEventNoteIcon from "@mui/icons-material/EventNote";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIEventNoteIconProps = SvgIconProps;

export function UIEventNoteIcon(props: UIEventNoteIconProps): ReactElement {
  return <MuiEventNoteIcon {...props} />;
}
