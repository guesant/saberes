import { Typography as MuiTypography } from "@mui/material";
import type { TypographyProps as MuiTypographyProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIGrowingTextProps = MuiTypographyProps;

export function UIGrowingText(props: UIGrowingTextProps): ReactElement {
  return <MuiTypography {...props} data-ui-layout="row" sx={{ flex: 1, ...props.sx }} />;
}
