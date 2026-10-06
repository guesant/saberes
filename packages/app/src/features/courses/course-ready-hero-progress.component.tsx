import { UIContentGroup, UILinearProgress, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CourseReadyHeroProgressProps } from "./course-ready-hero-progress-props.interface";

export function CourseReadyHeroProgress(props: CourseReadyHeroProgressProps) {
  const { t } = useTranslation();

  return (
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
  );
}
