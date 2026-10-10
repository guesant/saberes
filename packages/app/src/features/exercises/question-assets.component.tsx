import { QuestionPdfPageSection } from "./question-pdf-page-section.component";
import type { QuestionAssetsProps } from "./question-assets-props.interface";

export function QuestionAssets(props: QuestionAssetsProps) {
  if (props.pdfPages.length === 0) {
    return null;
  }

  return <QuestionPdfPageSection pages={props.pdfPages} />;
}
