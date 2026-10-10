import type { PdfPageRenderState } from "./pdf-page-render-state.interface";
import type { PdfPanHandlers } from "./pdf-pan-handlers.interface";
import type { RefCallback, RefObject, WheelEvent } from "react";

export interface PdfPageViewportProps extends PdfPageRenderState, PdfPanHandlers {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  pageNumber: number;
  title: string;
  viewportRef: RefCallback<HTMLDivElement>;
  onWheel(event: WheelEvent<HTMLDivElement>): void;
  zoom: number;
}
