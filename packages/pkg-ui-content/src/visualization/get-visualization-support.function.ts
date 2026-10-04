import type { VisualizationSupport } from "./visualization-support.interface";

export function getVisualizationSupport(): VisualizationSupport {
  const browser = typeof window !== "undefined";

  return {
    canvas2d: browser && typeof CanvasRenderingContext2D !== "undefined",
    webgl: browser && typeof WebGLRenderingContext !== "undefined",
  };
}
