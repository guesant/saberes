import type { RenderPdfPageInput } from "./render-pdf-page-input.interface";
import type { RenderTask } from "pdfjs-dist";

export async function renderPdfPage(input: RenderPdfPageInput): Promise<RenderTask> {
  const page = await input.document.getPage(input.pageNumber);

  const baseViewport = page.getViewport({ scale: 1 });

  const widthScale = Math.max(120, input.size.width - 40) / baseViewport.width;

  const heightScale = Math.max(160, input.size.height - 40) / baseViewport.height;

  const scale = Math.min(widthScale, heightScale) * input.zoom;

  const viewport = page.getViewport({ scale });

  const context = input.canvas.getContext("2d");

  if (!context) {
    throw new Error("Este navegador não conseguiu preparar a área de desenho do PDF.");
  }

  const outputScale = Math.min(window.devicePixelRatio || 1, 2);

  input.canvas.width = Math.floor(viewport.width * outputScale);

  input.canvas.height = Math.floor(viewport.height * outputScale);

  input.canvas.style.width = `${Math.floor(viewport.width)}px`;

  input.canvas.style.height = `${Math.floor(viewport.height)}px`;

  return page.render({
    canvas: input.canvas,
    canvasContext: context,
    viewport,
    transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
  });
}
