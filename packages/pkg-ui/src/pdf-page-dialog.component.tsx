import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { UIBox } from "./box.component";
import { UIPdfPageToolbar } from "./pdf-page-toolbar.component";
import { UIPdfPageViewport } from "./pdf-page-viewport.component";
import { UITypography } from "./typography.component";
import { usePdfDocument } from "./use-pdf-document.function";
import { usePdfPageRenderer } from "./use-pdf-page-renderer.function";
import { usePdfPan } from "./use-pdf-pan.function";
import { usePdfViewport } from "./use-pdf-viewport.function";
import { usePdfZoom } from "./use-pdf-zoom.function";
import type { UIPdfPageDialogProps } from "./pdf-page-dialog-props.interface";
import type { ReactElement } from "react";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export function UIPdfPageDialog(props: UIPdfPageDialogProps): ReactElement {
  const [documentState, setPageNumber] = usePdfDocument(props);

  const viewport = usePdfViewport(props.open);

  const zoom = usePdfZoom();

  const page = usePdfPageRenderer({
    document: documentState.document,
    open: props.open,
    pageNumber: documentState.pageNumber,
    size: viewport.size,
    zoom: zoom.zoom,
  });

  const pan = usePdfPan(viewport.scrollRef, zoom.zoom);

  return (
    <Dialog
      fullScreen
      onClose={props.onClose}
      open={props.open}
      PaperProps={{ sx: { display: "flex", flexDirection: "column", minHeight: 0 } }}
      slotProps={{ transition: { onEntered: viewport.onEntered } }}
    >
      <UIBox align="center" component={DialogTitle} gap="md" inset="md" layout="row" sx={{ borderBottom: 1, borderColor: "divider", justifyContent: "space-between" }}>
        <UITypography component="span" noWrap variant="h6">{props.title}</UITypography>
        <IconButton aria-label="Fechar visualizador de PDF" onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </UIBox>
      <UIBox
        component={DialogContent}
        inset="none"
        layout="native"
        sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column", minHeight: 0, overflow: "hidden", p: 0 }}
      >
        <UIPdfPageToolbar
          onFit={() => { zoom.setZoom(1); }}
          onNext={() => { setPageNumber(Math.min(documentState.pageCount, documentState.pageNumber + 1)); }}
          onPrevious={() => { setPageNumber(Math.max(1, documentState.pageNumber - 1)); }}
          onZoomIn={() => { zoom.changeZoom(0.2); }}
          onZoomOut={() => { zoom.changeZoom(-0.2); }}
          pageCount={documentState.pageCount}
          pageNumber={documentState.pageNumber}
          zoom={zoom.zoom}
        />
        <UIPdfPageViewport
          {...page}
          onPointerDown={pan.onPointerDown}
          onPointerMove={pan.onPointerMove}
          onPointerUp={pan.onPointerUp}
          onWheel={zoom.onWheel}
          pageNumber={documentState.pageNumber}
          title={props.title}
          viewportRef={viewport.ref}
          zoom={zoom.zoom}
          error={page.error || documentState.error}
          loading={page.loading || documentState.loading}
        />
      </UIBox>
    </Dialog>
  );
}
