import type { PdfDocumentAction } from "./pdf-document-action.type";
import type { PdfDocumentState } from "./pdf-document-state.interface";

export function reducePdfDocumentState(state: PdfDocumentState, action: PdfDocumentAction): PdfDocumentState {
  if (action.type === "closed") {
    return { document: null, error: null, loading: false, pageCount: 0, pageNumber: 1 };
  }

  if (action.type === "loading") {
    return { document: null, error: null, loading: true, pageCount: 0, pageNumber: action.page };
  }

  if (action.type === "loaded") {
    return { document: action.document, error: null, loading: false, pageCount: action.document.numPages, pageNumber: action.page };
  }

  if (action.type === "failed") {
    return { ...state, error: action.error, loading: false };
  }

  return { ...state, pageNumber: action.pageNumber };
}
