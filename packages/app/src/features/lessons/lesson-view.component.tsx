import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { LessonViewReadyContent } from "./lesson-view-ready-content.component";
import { useLessonViewModel } from "./lesson.view-model";

export function LessonView() {
  const { t } = useTranslation();

  const { lessonId } = useParams();

  const navigate = useNavigate();

  const viewModel = useLessonViewModel(`lesson:${lessonId}`);

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingLesson")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  if (!viewModel.data) {
    return <ContentNotFoundState label={t("lesson.notFound")} />;
  }

  return (
    <LessonViewReadyContent
      onQuestion={(id) => {
        return navigate(`/questoes/${id}`);
      }}
      data={viewModel.data}
      viewModel={viewModel}
    />
  );
}
