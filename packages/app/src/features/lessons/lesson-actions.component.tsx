import {
  UIBookmarkBorderIcon,
  UIButton,
  UICheckCircleIcon,
  UIInlineActions,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type LessonActionsProps = {
  completed: boolean;
  bookmarked: boolean;
  onComplete(value: boolean): Promise<void>;

  onBookmark(): Promise<void>;
};

export function LessonActions(props: LessonActionsProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions>
      <UIButton variant="outlined" startIcon={<UIBookmarkBorderIcon />} onClick={props.onBookmark}>
        {props.bookmarked ? t("lesson.saved") : t("lesson.save")}
      </UIButton>

      <UIButton
        variant="contained"
        startIcon={<UICheckCircleIcon />}
        onClick={() => {
          return props.onComplete(!props.completed);
        }}
      >
        {props.completed ? t("lesson.completed") : t("lesson.complete")}
      </UIButton>
    </UIInlineActions>
  );
}
