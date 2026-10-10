import { UIButton, UIPdfIcon, UIPdfPageDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import type { QuestionPdfPageOpenButtonProps } from "./question-pdf-page-open-button-props.interface";
import type { ReactElement } from "react";

export function QuestionPdfPageOpenButton(props: QuestionPdfPageOpenButtonProps): ReactElement {
  const [open, setOpen] = useState(false);

  const sourceLabel = `${props.page.year} · ${props.page.paperVersionCode || props.page.paperName}`;

  return (
    <>
      <UIButton onClick={() => { setOpen(true); }} startIcon={<UIPdfIcon />}>
        Abrir página {props.page.page} · {sourceLabel}
      </UIButton>
      <UIPdfPageDialog
        onClose={() => { setOpen(false); }}
        open={open}
        page={props.page.page}
        src={`${import.meta.env.BASE_URL}data/${props.page.path}`}
        title={`${sourceLabel} · página ${props.page.page}`}
      />
    </>
  );
}
