import type { QuestionReadModel } from "@guesant/saberes-application";

export interface QuestionAssetsProps {
  pdfPages: NonNullable<QuestionReadModel["pdfPages"]>;
}
