import type { QuestionReadModel } from "@guesant/saberes-application";

export interface QuestionPdfPageSectionProps {
  pages: NonNullable<QuestionReadModel["pdfPages"]>;
}
