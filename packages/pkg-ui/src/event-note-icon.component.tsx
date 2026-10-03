import MuiEventNoteIcon from "@mui/icons-material/EventNote";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type EventNoteIconProps = SvgIconProps;

export function EventNoteIcon(props: EventNoteIconProps): ReactElement {
  return <MuiEventNoteIcon {...props} />;
}
