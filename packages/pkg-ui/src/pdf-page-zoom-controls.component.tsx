import { FitScreen as FitScreenIcon, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { UIBox } from "./box.component";
import { UITypography } from "./typography.component";
import type { PdfPageZoomControlsProps } from "./pdf-page-zoom-controls-props.interface";
import type { ReactElement } from "react";

export function UIPdfPageZoomControls(props: PdfPageZoomControlsProps): ReactElement {
  return (
    <UIBox align="center" gap="sm" inset="none" layout="row">
      <IconButton aria-label="Diminuir zoom" disabled={props.zoom <= 0.65} onClick={props.onZoomOut}>
        <ZoomOutIcon />
      </IconButton>
      <UITypography component="span" variant="body2">{Math.round(props.zoom * 100)}%</UITypography>
      <IconButton aria-label="Aumentar zoom" disabled={props.zoom >= 4} onClick={props.onZoomIn}>
        <ZoomInIcon />
      </IconButton>
      <IconButton aria-label="Ajustar página à tela" onClick={props.onFit}>
        <FitScreenIcon />
      </IconButton>
    </UIBox>
  );
}
