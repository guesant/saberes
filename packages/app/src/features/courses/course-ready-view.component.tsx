import {
  Button,
  Card,
  CheckCircleIcon,
  Chip,
  PlayArrowIcon,
  Typography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CourseModules } from "./course-modules.component";
import type { CourseReadModel } from "@guesant/saberes-application";

export type CourseReadyViewProps = {
  data: CourseReadModel;
  started: boolean;
  onStart: () => Promise<void>;
};

export function CourseReadyView(props: CourseReadyViewProps) {
  const { data, started, onStart } = props;

  const { t } = useTranslation();

  const { course } = data;

  const courseType = course.course_type === "specific" ? t("course.specific") : t("course.general");

  return (
    <>
      <Card sx={{ p: { xs: 2, md: 5 }, mb: 4 }}>
        <Chip label={courseType} variant="outlined" />

        <Typography variant="h2">{String(course.title)}</Typography>

        <Typography>{String(course.description || "")}</Typography>

        <Button
          variant="contained"
          startIcon={started ? <CheckCircleIcon /> : <PlayArrowIcon />}
          onClick={onStart}
        >
          {started ? t("course.continue") : t("course.start")}
        </Button>
      </Card>

      <Typography variant="h5">{t("course.learnInSequence")}</Typography>

      <CourseModules modules={data.modules} items={data.items} />
    </>
  );
}
