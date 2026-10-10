import { getDocument } from "pdfjs-dist";
import { useEffect, useReducer } from "react";
import { reducePdfDocumentState } from "./reduce-pdf-document-state.function";
import type { PdfDocumentState } from "./pdf-document-state.interface";
import type { UIPdfPageDialogProps } from "./pdf-page-dialog-props.interface";

const INITIAL_PDF_DOCUMENT_STATE: PdfDocumentState = {
  document: null,
  error: null,
  loading: false,
  pageCount: 0,
  pageNumber: 1,
};

export function usePdfDocument(props: UIPdfPageDialogProps): [PdfDocumentState, (pageNumber: number) => void] {
  const [state, dispatch] = useReducer(reducePdfDocumentState, INITIAL_PDF_DOCUMENT_STATE);

  useEffect(() => {
    if (!props.open) {
      dispatch({ type: "closed" });

      return undefined;
    }

    let active = true;

    const task = getDocument({ url: props.src, disableRange: true, disableStream: true });

    dispatch({ type: "loading", page: props.page });

    task.promise.then((document) => {
      if (active) {
        const page = Math.min(Math.max(1, props.page), document.numPages);

        dispatch({ type: "loaded", document, page });
      }
    })
      .catch((error: unknown) => {
        if (active) {
          const message = error instanceof Error ? error.message : "Não foi possível abrir o PDF.";

          dispatch({ type: "failed", error: message });
        }
      });

    return () => {
      active = false;

      Promise.resolve(task.destroy())
        .catch(() => {return undefined;});
    };
  }, [props.open, props.page, props.src]);

  return [state, (pageNumber) => { dispatch({ pageNumber, type: "page" }); }];
}
