import MuiSearchIcon from "@mui/icons-material/Search";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UISearchIconProps = SvgIconProps;

export function UISearchIcon(props: UISearchIconProps): ReactElement {
  return <MuiSearchIcon {...props} />;
}
