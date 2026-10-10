import { useCallback, useState } from "react";
import type { WheelEvent } from "react";

const MIN_PDF_ZOOM = 0.65;

const MAX_PDF_ZOOM = 4;

export function usePdfZoom() {
  const [zoom, setZoom] = useState(1);

  const changeZoom = useCallback((amount: number) => {
    setZoom((current) => {return Math.min(MAX_PDF_ZOOM, Math.max(MIN_PDF_ZOOM, current + amount));});
  }, []);

  const onWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey) {
      return;
    }

    event.preventDefault();

    changeZoom(event.deltaY < 0 ? 0.15 : -0.15);
  }, [changeZoom]);

  return { changeZoom, onWheel, setZoom, zoom };
}
