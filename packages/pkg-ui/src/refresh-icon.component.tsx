import MuiRefreshIcon from "@mui/icons-material/Refresh";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type RefreshIconProps = SvgIconProps;

export function RefreshIcon(props: RefreshIconProps): ReactElement {
  return <MuiRefreshIcon {...props} />;
}
