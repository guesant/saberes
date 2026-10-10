import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { CourseProgressError } from "./course-progress-error.component";
import { CourseReadyView } from "./course-ready-view.component";
import { useCourseViewModel } from "./course.view-model";
import type { CourseRouteParams } from "./course-route-params.type";

export function CourseView() {
  const { t } = useTranslation();

  const routeParams = useParams<CourseRouteParams>();

  const viewModel = useCourseViewModel(routeParams.slug);

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingCourse")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  if (!viewModel.data) {
    return <ContentNotFoundState label={t("course.notFound")} />;
  }

  return (
    <>
      <CourseProgressError error={viewModel.progressError} />
      <CourseReadyView
        data={viewModel.data}
        attempts={viewModel.attempts}
        progress={viewModel.progress}
        lessonProgress={viewModel.lessonProgress}
        assessmentItemsById={viewModel.assessmentItemsById}
        startError={viewModel.startError}
        startState={viewModel.startState}
        started={viewModel.started}
        onStart={viewModel.startCourse}
      />
    </>
  );
}
