import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { QuestionReadyView } from "./question-ready-view.component";
import { useQuestionViewModel } from "./question.view-model";

export function QuestionView() {
  const { t } = useTranslation();

  const { questionId } = useParams();

  const viewModel = useQuestionViewModel(`question:${questionId}`);

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingQuestion")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  if (!viewModel.data) {
    return <ContentNotFoundState label={t("exercise.notFound")} />;
  }

  return <QuestionReadyView data={viewModel.data} onSubmit={viewModel.submit} />;
}
