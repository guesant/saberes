import { UIButton, UIContentGroup, UIDialog, UIInlineActions } from "@guesant/saberes-ui";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useActionToast } from "../../components/use-action-toast.hook";
import { QuestionBookmarkAction } from "./question-bookmark-action.component";
import { QuestionBookmarkError } from "./question-bookmark-error.component";
import { QuestionPriorKnowledge } from "./question-prior-knowledge.component";
import type { QuestionContextDisclosureProps } from "./question-context-disclosure-props.interface";

export function QuestionContextDisclosure(props: QuestionContextDisclosureProps) {
  const { t } = useTranslation();
  const toast = useActionToast();

  const [open, setOpen] = useState(false);
  const bookmarkWasPending = useRef(false);

  useEffect(() => {
    if (props.bookmarkPending) {
      bookmarkWasPending.current = true;
      return;
    }

    if (!bookmarkWasPending.current) {
      return;
    }

    bookmarkWasPending.current = false;

    if (!props.bookmarkError) {
      toast.enqueue(t(props.bookmarked ? "exercise.saved" : "exercise.removed"), "success");
    }
  }, [props.bookmarkError, props.bookmarkPending, props.bookmarked, t, toast]);

  return (
    <UIContentGroup variant="content">
      <UIInlineActions justify="end" wrap>
        <QuestionBookmarkAction
          bookmarked={props.bookmarked}
          onBookmark={props.onBookmark}
          pending={props.bookmarkPending}
        />
        <UIButton
          onClick={() => {
            return setOpen(true);
          }}
          variant="text"
        >
          {t("exercise.questionOptions")}
        </UIButton>
      </UIInlineActions>
      {props.bookmarkError ? (
        <QuestionBookmarkError error={props.bookmarkError} onRetry={props.onRetryBookmark} />
      ) : null}
      <UIDialog
        confirmLabel={t("common.done")}
        onClose={() => {
          return setOpen(false);
        }}
        open={open}
        title={t("exercise.questionOptions")}
      >
        <UIContentGroup variant="content">
          <QuestionPriorKnowledge onSelect={props.onPriorKnowledge} />
        </UIContentGroup>
      </UIDialog>
    </UIContentGroup>
  );
}
