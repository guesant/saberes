import { useEffect, useRef, useState } from "react";
import { renderPdfPage } from "./render-pdf-page.function";
import type { PdfPageRenderState } from "./pdf-page-render-state.interface";
import type { PdfViewportSize } from "./pdf-viewport-size.interface";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

export interface UsePdfPageRendererInput {
  document: PDFDocumentProxy | null;
  open: boolean;
  pageNumber: number;
  size: PdfViewportSize;
  zoom: number;
}

const EMPTY_PDF_PAGE_RENDER_STATE: PdfPageRenderState = { error: null, loading: false };

export function usePdfPageRenderer(input: UsePdfPageRendererInput) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [state, setState] = useState(EMPTY_PDF_PAGE_RENDER_STATE);

  useEffect(() => {
    if (!input.open || !input.document || !canvasRef.current || input.size.width <= 0 || input.size.height <= 0) {
      return undefined;
    }

    let active = true;

    let renderTask: RenderTask | null = null;

    setState({ error: null, loading: true });

    renderPdfPage({ canvas: canvasRef.current, document: input.document, pageNumber: input.pageNumber, size: input.size, zoom: input.zoom })
      .then((task) => {
        if (!active) {
          task.cancel();

          return undefined;
        }

        renderTask = task;

        return task.promise;
      })
      .then(() => {
        if (active) {
          setState({ error: null, loading: false });
        }
      })
      .catch((error: unknown) => {
        if (active && !(error instanceof Error && error.name === "RenderingCancelledException")) {
          const message = error instanceof Error ? error.message : "Não foi possível exibir esta página.";

          setState({ error: message, loading: false });
        }
      });

    return () => {
      active = false;

      renderTask?.cancel();
    };
  }, [input.document, input.open, input.pageNumber, input.size.height, input.size.width, input.zoom]);

  return { ...state, canvasRef };
}
