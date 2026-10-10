import { UICourseHeroCard, UIButton, UIChip, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ActionFeedback } from "../../components/action-feedback.component";
import { CourseReadyHeroProgress } from "./course-ready-hero-progress.component";
import { getCourseHeroState } from "./get-course-hero-state.function";
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

  const state = getCourseHeroState(props);

  let actionLabel = t(state.actionKey);

  if (state.finished) {
    actionLabel = "Curso concluído";
  }

  return (
    <UICourseHeroCard
      action={
        <UIButton
          aria-label={actionLabel}
          disabled={props.startState === "saving" || state.finished}
          onClick={props.onStart}
        />
      }
    >
      <UIChip label={t(state.courseTypeKey)} variant="outlined" />
      <UITypography variant="h2">{String(course.title)}</UITypography>
      <UITypography>{String(course.description || "")}</UITypography>
      <CourseReadyHeroProgress progress={props.progress} />
      <UITypography color="primary" variant="button">
        {actionLabel}
        {state.actionSuffix}
      </UITypography>
      <ActionFeedback error={props.startError} state={props.startState} />
    </UICourseHeroCard>
  );
}
