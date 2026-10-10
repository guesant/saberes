import type { PDFDocumentProxy } from "pdfjs-dist";

export interface PdfDocumentState {
  document: PDFDocumentProxy | null;
  error: string | null;
  loading: boolean;
  pageCount: number;
  pageNumber: number;
}
