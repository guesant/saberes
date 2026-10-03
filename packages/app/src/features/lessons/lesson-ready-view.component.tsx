import { Button, Divider, Paper, Stack, Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { LessonActions } from "./lesson-actions.component";
import { LessonSectionNavigation } from "./lesson-section-navigation.component";
import { LessonSections } from "./lesson-sections.component";
import type { LessonReadModel } from "@guesant/saberes-application";

export type LessonReadyViewProps = {
  data: LessonReadModel;
  completed: boolean;
  bookmarked: boolean;
  onComplete: (value: boolean) => Promise<void>;
  onBookmark: () => Promise<void>;
  onQuestion: (questionId: string | number) => void;
};

export function LessonReadyView(props: LessonReadyViewProps) {
  const { data, completed, bookmarked, onComplete, onBookmark, onQuestion } = props;

  const { t } = useTranslation();

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography variant="overline">{t("lesson.label")}</Typography>

          <Typography variant="h3">{String(data.lesson.title)}</Typography>

          <Typography color="text.secondary">{String(data.lesson.intro || "")}</Typography>
        </Stack>

        <LessonActions
          completed={completed}
          bookmarked={bookmarked}
          onComplete={onComplete}
          onBookmark={onBookmark}
        />
      </Stack>

      <Paper variant="outlined">
        <LessonSectionNavigation sections={data.sections} />
      </Paper>

      <Paper>
        <LessonSections sections={data.sections} onQuestion={onQuestion} />
      </Paper>

      <Divider />

      <Button variant="contained">{t("lesson.practice")}</Button>
    </>
  );
}
