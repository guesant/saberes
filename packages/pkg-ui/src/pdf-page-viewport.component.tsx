import { UIBox } from "./box.component";
import { UIPdfPageError } from "./pdf-page-error.component";
import { UIPdfPageLoading } from "./pdf-page-loading.component";
import type { PdfPageViewportProps } from "./pdf-page-viewport-props.interface";
import type { ReactElement } from "react";

export function UIPdfPageViewport(props: PdfPageViewportProps): ReactElement {
  return (
    <UIBox
      onWheel={props.onWheel}
      ref={props.viewportRef}
      inset="none"
      layout="column"
      sx={{ bgcolor: "grey.900", flex: "1 1 auto", minHeight: 0, overflow: "auto", textAlign: "center" }}
    >
      <UIPdfPageError error={props.error} />
      <UIPdfPageLoading loading={props.loading} />
      <UIBox
        aria-label={`Página ${props.pageNumber} do documento ${props.title}`}
        component="canvas"
        inset="none"
        onPointerDown={props.onPointerDown}
        onPointerMove={props.onPointerMove}
        onPointerUp={props.onPointerUp}
        ref={props.canvasRef}
        layout="flow"
        sx={{ cursor: props.zoom > 1 ? "grab" : "default", display: props.error ? "none" : "block", maxWidth: "none", mx: "auto", touchAction: "none" }}
      />
    </UIBox>
  );
}
