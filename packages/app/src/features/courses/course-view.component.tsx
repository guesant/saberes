import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { CourseReadyView } from "./course-ready-view.component";
import { useCourseViewModel } from "./course.view-model";

export function CourseView() {
  const { t } = useTranslation();

  const routeParams = useParams<{ slug: string }>();

  const viewModel = useCourseViewModel(routeParams.slug);

  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    await viewModel.startCourse();

    setStarted(true);
  };

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingCourse")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  if (!viewModel.data) {
    return <ContentNotFoundState label={t("course.notFound")} />;
  }

  return <CourseReadyView data={viewModel.data} started={started} onStart={handleStart} />;
}
