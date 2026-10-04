import { UIBookmarkBorderIcon, UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionBookmarkActionProps } from "./question-bookmark-action-props.type";

export function QuestionBookmarkAction(props: QuestionBookmarkActionProps) {
  const { t } = useTranslation();

  return (
    <UIButton variant="outlined" startIcon={<UIBookmarkBorderIcon />} onClick={props.onBookmark}>
      {props.bookmarked ? t("exercise.saved") : t("exercise.save")}
    </UIButton>
  );
}
