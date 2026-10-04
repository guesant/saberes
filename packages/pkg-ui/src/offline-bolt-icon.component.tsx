import MuiOfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIOfflineBoltIconProps = SvgIconProps;

export function UIOfflineBoltIcon(props: UIOfflineBoltIconProps): ReactElement {
  return <MuiOfflineBoltIcon {...props} />;
}
