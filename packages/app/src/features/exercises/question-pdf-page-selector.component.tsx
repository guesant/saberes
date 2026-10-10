import { UISelectField } from "@guesant/saberes-ui";
import type { QuestionPdfPageSelectorProps } from "./question-pdf-page-selector-props.interface";
import type { UiSelectFieldOption } from "@guesant/saberes-ui";
import type { ReactElement } from "react";

export function QuestionPdfPageSelector(props: QuestionPdfPageSelectorProps): ReactElement | null {
  if (props.pages.length < 2) {
    return null;
  }

  return (
    <UISelectField
      label="Edição e caderno de origem"
      onChange={(value) => { props.onSelect(Number(value)); }}
      options={props.pages.map((page, index): UiSelectFieldOption => {return {
        label: `${page.year} · ${page.paperVersionCode || page.paperName} · página ${page.page}`,
        value: String(index),
      };})}
      value={String(props.value)}
    />
  );
}
