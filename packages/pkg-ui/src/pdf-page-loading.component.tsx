import { CircularProgress } from "@mui/material";
import { UIBox } from "./box.component";
import { UITypography } from "./typography.component";
import type { ReactElement } from "react";
import type { PdfPageLoadingProps } from "./pdf-page-loading-props.interface";

export function UIPdfPageLoading(props: PdfPageLoadingProps): ReactElement | null {
  if (!props.loading) {
    return null;
  }

  return (
    <UIBox align="center" aria-label="Carregando PDF" gap="sm" inset="md" layout="row">
      <CircularProgress size={20} />
      <UITypography component="span" variant="body2">Carregando página…</UITypography>
    </UIBox>
  );
}
