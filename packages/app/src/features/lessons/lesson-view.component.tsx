import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { LessonReadyView } from "./lesson-ready-view.component";
import { useLessonViewModel } from "./lesson.view-model";

export function LessonView() {
  const { t } = useTranslation();

  const { lessonId } = useParams();

  const navigate = useNavigate();

  const viewModel = useLessonViewModel(`lesson:${lessonId}`);

  const [completed, setCompleted] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);

  const handleComplete = async (value: boolean) => {
    await viewModel.saveProgress(value);

    setCompleted(value);
  };

  const handleBookmark = async () => {
    await viewModel.saveBookmark();

    setBookmarked(true);
  };

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
    <LessonReadyView
      data={viewModel.data}
      completed={completed}
      bookmarked={bookmarked}
      onComplete={handleComplete}
      onBookmark={handleBookmark}
      onQuestion={(id) => navigate(`/questoes/${id}`)}
    />
  );
}
