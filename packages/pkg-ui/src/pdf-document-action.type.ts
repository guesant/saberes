import type { PDFDocumentProxy } from "pdfjs-dist";

export type PdfDocumentAction =
  | { type: "closed" }
  | { document: PDFDocumentProxy; page: number; type: "loaded" }
  | { error: string; type: "failed" }
  | { page: number; type: "loading" }
  | { pageNumber: number; type: "page" };
