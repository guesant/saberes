import {
  UIButton,
  UICheckCircleIcon,
  UICourseHeroCard,
  UIChip,
  UIContentGroup,
  UILinearProgress,
  UIPlayArrowIcon,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CourseProgress } from "./course-progress.interface";
import type { CourseReadModel } from "@guesant/saberes-application";

export interface CourseReadyHeroProps {
  data: CourseReadModel;
  onStart(): Promise<void>;
  progress: CourseProgress;
  started: boolean;
}

export function CourseReadyHero(props: CourseReadyHeroProps) {
  const { t } = useTranslation();

  const { course } = props.data;

  const courseType = course.course_type === "specific" ? t("course.specific") : t("course.general");

  return (
    <UICourseHeroCard>
      <UIChip label={courseType} variant="outlined" />
      <UITypography variant="h2">{String(course.title)}</UITypography>
      <UITypography>{String(course.description || "")}</UITypography>
      <UIContentGroup variant="content">
        <UITypography variant="body2">
          {t("course.progress", {
            completed: props.progress.completedItems,
            percentage: props.progress.percentage,
            total: props.progress.totalItems,
          })}
        </UITypography>
        <UILinearProgress
          aria-label={t("course.progressLabel")}
          value={props.progress.percentage}
          variant="determinate"
        />
      </UIContentGroup>
      <UIButton
        onClick={props.onStart}
        startIcon={props.started ? <UICheckCircleIcon /> : <UIPlayArrowIcon />}
        variant="contained"
      >
        {props.started ? t("course.continue") : t("course.start")}
      </UIButton>
    </UICourseHeroCard>
  );
}
