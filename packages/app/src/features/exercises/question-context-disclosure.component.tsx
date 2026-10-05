import { UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { QuestionBookmarkAction } from "./question-bookmark-action.component";
import { QuestionBookmarkError } from "./question-bookmark-error.component";
import { QuestionPriorKnowledge } from "./question-prior-knowledge.component";
import type { QuestionContextDisclosureProps } from "./question-context-disclosure-props.interface";

export function QuestionContextDisclosure(props: QuestionContextDisclosureProps) {
  const { t } = useTranslation();

  return (
    <UIDisclosure summary={t("exercise.moreOptions")}>
      <QuestionPriorKnowledge onSelect={props.onPriorKnowledge} />
      <QuestionBookmarkAction bookmarked={props.bookmarked} onBookmark={props.onBookmark} />
      {props.bookmarkError ? (
        <QuestionBookmarkError error={props.bookmarkError} onRetry={props.onRetryBookmark} />
      ) : null}
    </UIDisclosure>
  );
}
