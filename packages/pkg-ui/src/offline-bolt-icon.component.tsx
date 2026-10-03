import MuiOfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type OfflineBoltIconProps = SvgIconProps;

export function OfflineBoltIcon(props: OfflineBoltIconProps): ReactElement {
  return <MuiOfflineBoltIcon {...props} />;
}
