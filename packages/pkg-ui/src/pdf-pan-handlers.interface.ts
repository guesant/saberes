import type { PointerEvent } from "react";

export interface PdfPanHandlers {
  onPointerDown(event: PointerEvent<HTMLCanvasElement>): void;

  onPointerMove(event: PointerEvent<HTMLCanvasElement>): void;

  onPointerUp(): void;
}
