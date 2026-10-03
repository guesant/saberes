import {
  Typography as MuiTypography,
  type TypographyProps as MuiTypographyProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type TypographyProps = MuiTypographyProps & {
  to?: string;
};

export function Typography(props: TypographyProps): ReactElement {
  return <MuiTypography {...(props as MuiTypographyProps)} />;
}
