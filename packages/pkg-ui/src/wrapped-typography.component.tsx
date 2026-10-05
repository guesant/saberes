import { Typography as MuiTypography } from "@mui/material";
import type { UIWrappedTypographyProps } from "./wrapped-typography-props.interface";
import type { ReactElement } from "react";

export function UIWrappedTypography(props: UIWrappedTypographyProps): ReactElement {
  return (
    <MuiTypography
      color={props.color}
      data-ui-layout="stack"
      sx={{
        maxWidth: "100%",
        minWidth: 0,
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
      variant={props.variant}
    >
      {props.children}
    </MuiTypography>
  );
}
