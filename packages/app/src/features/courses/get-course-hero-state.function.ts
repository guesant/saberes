import type { CourseReadyHeroProps } from "./course-ready-hero.component";

export function getCourseHeroState(props: CourseReadyHeroProps) {
  const finished = props.progress.totalItems > 0 && props.progress.completedItems === props.progress.totalItems;

  let courseTypeKey: "course.specific" | "course.general" = "course.general";

  let actionKey: "course.continue" | "course.start" = "course.start";

  let actionSuffix = " →";

  if (props.data.course.course_type === "specific") {
    courseTypeKey = "course.specific";
  }

  if (props.started) {
    actionKey = "course.continue";
  }

  if (finished) {
    actionSuffix = "";
  }

  return {
    finished,
    courseTypeKey,
    actionKey,
    actionSuffix,
  };
}
