export interface PdfPageNavigationControlsProps {
  onNext(): void;

  onPrevious(): void;
  pageCount: number;
  pageNumber: number;
}
