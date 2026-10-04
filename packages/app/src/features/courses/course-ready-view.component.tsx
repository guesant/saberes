import {
  UIButton,
  UICourseHeroCard,
  UICheckCircleIcon,
  UIChip,
  UILinearProgress,
  UIPlayArrowIcon,
  UIContentGroup,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CourseModules } from "./course-modules.component";
import type { CourseProgress } from "./course-progress.interface";
import type { CourseReadModel } from "@guesant/saberes-application";

export type CourseReadyViewProps = {
  data: CourseReadModel;
  started: boolean;
  progress: CourseProgress;
  onStart: () => Promise<void>;
};

export function CourseReadyView(props: CourseReadyViewProps) {
  const { data, progress, started, onStart } = props;

  const { t } = useTranslation();

  const { course } = data;

  const courseType = course.course_type === "specific" ? t("course.specific") : t("course.general");

  return (
    <>
      <UICourseHeroCard>
        <UIChip label={courseType} variant="outlined" />

        <UITypography variant="h2">{String(course.title)}</UITypography>

        <UITypography>{String(course.description || "")}</UITypography>

        <UIContentGroup variant="tight">
          <UITypography variant="body2">
            {t("course.progress", {
              completed: progress.completedItems,
              percentage: progress.percentage,
              total: progress.totalItems,
            })}
          </UITypography>

          <UILinearProgress value={progress.percentage} variant="determinate" />
        </UIContentGroup>

        <UIButton
          variant="contained"
          startIcon={started ? <UICheckCircleIcon /> : <UIPlayArrowIcon />}
          onClick={onStart}
        >
          {started ? t("course.continue") : t("course.start")}
        </UIButton>
      </UICourseHeroCard>

      <UITypography variant="h5">{t("course.learnInSequence")}</UITypography>

      <CourseModules modules={data.modules} items={data.items} />
    </>
  );
}
