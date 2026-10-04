import { Typography as MuiTypography } from "@mui/material";
import { getContentTypographyVariant } from "./get-content-typography-variant.function";
import type { UIContentTextProps } from "./content-text-props.interface";
import type { ReactElement } from "react";

export function UIContentText(props: UIContentTextProps): ReactElement {
  return (
    <MuiTypography
      component={props.component ?? "p"}
      fontWeight={props.variant === "title" ? 700 : undefined}
      sx={{ whiteSpace: props.preserveWhitespace ? "pre-wrap" : undefined }}
      variant={getContentTypographyVariant(props.variant)}
    >
      {props.children}
    </MuiTypography>
  );
}
