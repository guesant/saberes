import type { PdfViewportSize } from "./pdf-viewport-size.interface";
import type { PDFDocumentProxy } from "pdfjs-dist";

export interface RenderPdfPageInput {
  canvas: HTMLCanvasElement;
  document: PDFDocumentProxy;
  pageNumber: number;
  size: PdfViewportSize;
  zoom: number;
}
