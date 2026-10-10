import { UIBox, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useState } from "react";
import { QuestionPdfPageOpenButton } from "./question-pdf-page-open-button.component";
import { QuestionPdfPageSelector } from "./question-pdf-page-selector.component";
import type { QuestionPdfPageSectionProps } from "./question-pdf-page-section-props.interface";
import type { ReactElement } from "react";

export function QuestionPdfPageSection(props: QuestionPdfPageSectionProps): ReactElement | null {
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  const selectedPage = props.pages[selectedPageIndex] || props.pages[0];

  if (!selectedPage) {
    return null;
  }

  return (
    <UIBox aria-label="Página original da questão" component="section" inset="none">
      <UIContentGroup variant="content">
        <UITypography variant="h6">Página original da prova</UITypography>
        <QuestionPdfPageSelector
          onSelect={setSelectedPageIndex}
          pages={props.pages}
          value={selectedPageIndex}
        />
        <QuestionPdfPageOpenButton page={selectedPage} />
      </UIContentGroup>
    </UIBox>
  );
}
