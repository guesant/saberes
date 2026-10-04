import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { LessonProgressError } from "./lesson-progress-error.component";
import { LessonReadyView } from "./lesson-ready-view.component";
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
    <>
      {viewModel.progressError ? <LessonProgressError error={viewModel.progressError} /> : null}
      <LessonReadyView
        data={viewModel.data}
        completed={viewModel.completed}
        bookmarked={viewModel.bookmarked}
        sectionIndex={viewModel.sectionIndex}
        onComplete={viewModel.saveProgress}
        onBookmark={viewModel.saveBookmark}
        onSectionChange={viewModel.saveSection}
        onQuestion={(id) => {
          return navigate(`/questoes/${id}`);
        }}
      />
    </>
  );
}
