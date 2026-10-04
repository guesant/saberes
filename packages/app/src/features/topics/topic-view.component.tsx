import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { TopicReadyView } from "./topic-ready-view.component";
import { useTopicViewModel } from "./topic.view-model";

export function TopicView() {
  const { t } = useTranslation();

  const { slug } = useParams();

  const viewModel = useTopicViewModel(slug || "");

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingTopic")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  if (!viewModel.data) {
    return <ContentNotFoundState label={t("topics.notFound")} />;
  }

  return <TopicReadyView data={viewModel.data} />;
}
