import { useRef } from "react";
import type { PdfDragOrigin } from "./pdf-drag-origin.interface";
import type { PdfPanHandlers } from "./pdf-pan-handlers.interface";
import type { PointerEvent, RefObject } from "react";

export function usePdfPan(viewportRef: RefObject<HTMLDivElement | null>, zoom: number): PdfPanHandlers {
  const originRef = useRef<PdfDragOrigin | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const viewport = viewportRef.current;

    if (zoom <= 1 || !viewport) {
      return;
    }

    originRef.current = { clientX: event.clientX, clientY: event.clientY, scrollLeft: viewport.scrollLeft, scrollTop: viewport.scrollTop };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const viewport = viewportRef.current;

    const origin = originRef.current;

    if (!origin || !viewport) {
      return;
    }

    viewport.scrollLeft = origin.scrollLeft - (event.clientX - origin.clientX);

    viewport.scrollTop = origin.scrollTop - (event.clientY - origin.clientY);
  };

  return { onPointerDown, onPointerMove, onPointerUp: () => { originRef.current = null; } };
}
