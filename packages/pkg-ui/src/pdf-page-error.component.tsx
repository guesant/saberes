import { Alert } from "@mui/material";
import type { ReactElement } from "react";
import type { PdfPageErrorProps } from "./pdf-page-error-props.interface";

export function UIPdfPageError(props: PdfPageErrorProps): ReactElement | null {
  if (!props.error) {
    return null;
  }

  return <Alert severity="error">{props.error}</Alert>;
}
