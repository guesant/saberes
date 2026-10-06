import { UIButton, UIContentGroup, UIDialog, UIInlineActions } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QuestionBookmarkAction } from "./question-bookmark-action.component";
import { QuestionBookmarkError } from "./question-bookmark-error.component";
import { QuestionPriorKnowledge } from "./question-prior-knowledge.component";
import type { QuestionContextDisclosureProps } from "./question-context-disclosure-props.interface";

export function QuestionContextDisclosure(props: QuestionContextDisclosureProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <UIContentGroup variant="content">
      <UIInlineActions wrap>
        <QuestionBookmarkAction
          bookmarked={props.bookmarked}
          onBookmark={props.onBookmark}
          pending={props.bookmarkPending}
        />
        <UIButton onClick={() => {return setOpen(true);}} variant="text">
          {t("exercise.questionOptions")}
        </UIButton>
      </UIInlineActions>
      {props.bookmarkError ? (
        <QuestionBookmarkError error={props.bookmarkError} onRetry={props.onRetryBookmark} />
      ) : null}
      <UIDialog onClose={() => {return setOpen(false);}} open={open} title={t("exercise.questionOptions")}>
        <UIContentGroup variant="content">
          <QuestionPriorKnowledge onSelect={props.onPriorKnowledge} />
          <UIButton onClick={() => {return setOpen(false);}} variant="outlined">
            {t("backup.cancel")}
          </UIButton>
        </UIContentGroup>
      </UIDialog>
    </UIContentGroup>
  );
}
