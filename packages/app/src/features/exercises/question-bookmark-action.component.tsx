import { UIBookmarkBorderIcon, UIBookmarkIcon, UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionBookmarkActionProps } from "./question-bookmark-action-props.type";

export function QuestionBookmarkAction(props: QuestionBookmarkActionProps) {
  const { t } = useTranslation();

  return (
    <UIButton
      aria-pressed={props.bookmarked}
      disabled={props.pending}
      onClick={props.onBookmark}
      startIcon={props.bookmarked ? <UIBookmarkIcon /> : <UIBookmarkBorderIcon />}
      variant="outlined"
    >
      {props.bookmarked ? t("exercise.removeSaved") : t("exercise.save")}
    </UIButton>
  );
}
