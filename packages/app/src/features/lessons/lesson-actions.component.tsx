import {
  UIBookmarkIcon,
  UIBookmarkBorderIcon,
  UIButton,
  UICheckCircleIcon,
  UICheckCircleOutlineIcon,
  UIInlineActions,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { ActionState } from "../../types/action-state.type";

export type LessonActionsProps = {
  completed: boolean;
  bookmarked: boolean;
  bookmarkActionState: ActionState;
  onComplete(value: boolean): Promise<void>;
  progressActionState: ActionState;

  onBookmark(): Promise<void>;
};

export function LessonActions(props: LessonActionsProps) {
  const { t } = useTranslation();

  let bookmarkLabel = props.bookmarked ? t("lesson.saved") : t("lesson.save");

  if (props.bookmarkActionState === "saving") {
    bookmarkLabel = t("common.saving");
  }

  let progressLabel = props.completed ? t("lesson.completed") : t("lesson.complete");

  if (props.progressActionState === "saving") {
    progressLabel = t("common.saving");
  }

  return (
    <UIInlineActions>
      <UIButton
        aria-pressed={props.bookmarked}
        disabled={props.bookmarkActionState === "saving"}
        iconOnly
        iconShape="square"
        variant="outlined"
        startIcon={props.bookmarked ? <UIBookmarkIcon /> : <UIBookmarkBorderIcon />}
        onClick={props.onBookmark}
      >
        {bookmarkLabel}
      </UIButton>

      <UIButton
        aria-pressed={props.completed}
        variant="outlined"
        disabled={props.progressActionState === "saving"}
        iconOnly
        iconShape="square"
        startIcon={props.completed ? <UICheckCircleIcon /> : <UICheckCircleOutlineIcon />}
        onClick={() => {
          return props.onComplete(!props.completed);
        }}
      >
        {progressLabel}
      </UIButton>
    </UIInlineActions>
  );
}
