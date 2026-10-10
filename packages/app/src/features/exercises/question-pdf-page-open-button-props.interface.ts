import type { QuestionReadModel } from "@guesant/saberes-application";

export interface QuestionPdfPageOpenButtonProps {
  page: NonNullable<QuestionReadModel["pdfPages"]>[number];
}
