import { NavigateBefore as PreviousPageIcon, NavigateNext as NextPageIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { UIBox } from "./box.component";
import { UITypography } from "./typography.component";
import type { PdfPageNavigationControlsProps } from "./pdf-page-navigation-controls-props.interface";
import type { ReactElement } from "react";

export function UIPdfPageNavigationControls(props: PdfPageNavigationControlsProps): ReactElement {
  return (
    <UIBox align="center" gap="sm" inset="none" layout="row">
      <IconButton aria-label="Página anterior" disabled={props.pageNumber <= 1} onClick={props.onPrevious}>
        <PreviousPageIcon />
      </IconButton>
      <UITypography aria-live="polite" component="span" variant="body2">
        Página {props.pageNumber} de {props.pageCount || "…"}
      </UITypography>
      <IconButton
        aria-label="Próxima página"
        disabled={props.pageCount === 0 || props.pageNumber >= props.pageCount}
        onClick={props.onNext}
      >
        <NextPageIcon />
      </IconButton>
    </UIBox>
  );
}
