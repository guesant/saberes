import type { QuestionReadModel } from "@guesant/saberes-application";

export interface QuestionPdfPageSelectorProps {
  onSelect(index: number): void;
  pages: NonNullable<QuestionReadModel["pdfPages"]>;
  value: number;
}
