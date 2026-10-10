export interface PdfPageZoomControlsProps {
  onFit(): void;

  onZoomIn(): void;

  onZoomOut(): void;
  zoom: number;
}
