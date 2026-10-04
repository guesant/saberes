import MuiRefreshIcon from "@mui/icons-material/Refresh";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIRefreshIconProps = SvgIconProps;

export function UIRefreshIcon(props: UIRefreshIconProps): ReactElement {
  return <MuiRefreshIcon {...props} />;
}
