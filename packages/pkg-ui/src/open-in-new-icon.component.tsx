import MuiOpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type OpenInNewIconProps = SvgIconProps;

export function OpenInNewIcon(props: OpenInNewIconProps): ReactElement {
  return <MuiOpenInNewIcon {...props} />;
}
