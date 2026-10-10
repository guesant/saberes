import { useCallback, useEffect, useRef, useState } from "react";
import type { PdfViewportSize } from "./pdf-viewport-size.interface";

const EMPTY_PDF_VIEWPORT_SIZE: PdfViewportSize = { height: 0, width: 0 };

export function usePdfViewport(open: boolean) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const [size, setSize] = useState(EMPTY_PDF_VIEWPORT_SIZE);

  const ref = useCallback((element: HTMLDivElement | null) => {
    scrollRef.current = element;

    setNode(element);
  }, []);

  const updateSize = useCallback(() => {
    if (!node) {
      return;
    }

    // Measure the scrollable content box, not the border box. The canvas is a
    // child of this element; measuring the border box lets padding and the
    // scrollbar created by that same canvas feed back into the next render's
    // scale, causing ResizeObserver to oscillate around the fit size.
    const width = node.clientWidth;

    const height = node.clientHeight;

    if (width > 0 && height > 0) {
      setSize((current) => {return (current.width === width && current.height === height ? current : { height, width });});
    }
  }, [node]);

  useEffect(() => {
    if (!open || !node) {
      return undefined;
    }

    updateSize();

    window.addEventListener("resize", updateSize);

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateSize);

    observer?.observe(node);

    return () => {
      window.removeEventListener("resize", updateSize);

      observer?.disconnect();
    };
  }, [node, open, updateSize]);

  return { onEntered: updateSize, ref, scrollRef, size };
}
