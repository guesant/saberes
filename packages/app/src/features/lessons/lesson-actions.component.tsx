import { BookmarkBorderIcon, Button, CheckCircleIcon, Stack } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type LessonActionsProps = {
  completed: boolean;
  bookmarked: boolean;
  onComplete: (value: boolean) => Promise<void>;
  onBookmark: () => Promise<void>;
};

export function LessonActions(props: LessonActionsProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" startIcon={<BookmarkBorderIcon />} onClick={props.onBookmark}>
        {props.bookmarked ? t("lesson.saved") : t("lesson.save")}
      </Button>

      <Button
        variant="contained"
        startIcon={<CheckCircleIcon />}
        onClick={() => props.onComplete(!props.completed)}
      >
        {props.completed ? t("lesson.completed") : t("lesson.complete")}
      </Button>
    </Stack>
  );
}
