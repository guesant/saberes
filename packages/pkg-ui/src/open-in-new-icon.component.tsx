import MuiOpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIOpenInNewIconProps = SvgIconProps;

export function UIOpenInNewIcon(props: UIOpenInNewIconProps): ReactElement {
  return <MuiOpenInNewIcon {...props} />;
}
