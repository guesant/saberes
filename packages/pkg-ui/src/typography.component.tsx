import {
  Typography as MuiTypography,
  type TypographyProps as MuiTypographyProps,
} from "@mui/material";
import type { ReactElement } from "react";

export interface UITypographyProps extends MuiTypographyProps {
  to?: string;
}

export function UITypography(props: UITypographyProps): ReactElement {
  return <MuiTypography {...(props as MuiTypographyProps)} />;
}
