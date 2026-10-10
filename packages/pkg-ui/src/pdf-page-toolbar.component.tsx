import { Divider } from "@mui/material";
import { UIBox } from "./box.component";
import { UIPdfPageNavigationControls } from "./pdf-page-navigation-controls.component";
import { UIPdfPageZoomControls } from "./pdf-page-zoom-controls.component";
import { UITypography } from "./typography.component";
import type { PdfPageToolbarProps } from "./pdf-page-toolbar-props.interface";
import type { ReactElement } from "react";

export function UIPdfPageToolbar(props: PdfPageToolbarProps): ReactElement {
  return (
    <UIBox align="center" gap="sm" inset="sm" layout="row" wrap sx={{ borderBottom: 1, borderColor: "divider", justifyContent: "center" }}>
      <UIPdfPageNavigationControls {...props} />
      <Divider flexItem orientation="vertical" />
      <UIPdfPageZoomControls {...props} />
      <UITypography variant="caption" sx={{ display: { xs: "none", sm: "inline" } }}>
        Arraste a página para mover · Ctrl + rolagem para zoom
      </UITypography>
    </UIBox>
  );
}
