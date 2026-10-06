import {
  UICourseHeroCard,
  UIButton,
  UIChip,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ActionFeedback } from "../../components/action-feedback.component";
import { CourseReadyHeroProgress } from "./course-ready-hero-progress.component";
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

  const courseType = t(`course.${course.course_type === "specific" ? "specific" : "general"}`);

  return (
    <UICourseHeroCard
      action={
        <UIButton
          aria-label={t(props.started ? "course.continue" : "course.start")}
          disabled={props.startState === "saving"}
          onClick={props.onStart}
        />
      }
    >
      <UIChip label={courseType} variant="outlined" />
      <UITypography variant="h2">{String(course.title)}</UITypography>
      <UITypography>{String(course.description || "")}</UITypography>
      <CourseReadyHeroProgress progress={props.progress} />
      <UITypography color="primary" variant="button">
        {t(props.started ? "course.continue" : "course.start")} →
      </UITypography>
      <ActionFeedback error={props.startError} state={props.startState} />
    </UICourseHeroCard>
  );
}
