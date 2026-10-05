import {
  UICourseHeroCard,
  UIChip,
  UIContentGroup,
  UILinearProgress,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CourseStartAction } from "./course-start-action.component";
import type { CourseProgress } from "./course-progress.interface";
import type { CourseStartActionProps } from "./course-start-action-props.interface";
import type { CourseReadModel } from "@guesant/saberes-application";

export interface CourseReadyHeroProps extends CourseStartActionProps {
  data: CourseReadModel;
  progress: CourseProgress;
}

export function CourseReadyHero(props: CourseReadyHeroProps) {
  const { t } = useTranslation();

  const { course } = props.data;

  let courseType = t("course.general");

  if (course.course_type === "specific") {
    courseType = t("course.specific");
  }

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
      <CourseStartAction
        onStart={props.onStart}
        startError={props.startError}
        startState={props.startState}
        started={props.started}
      />
    </UICourseHeroCard>
  );
}
