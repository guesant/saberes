import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { TopicMapProgressError } from "./topic-map-progress-error.component";
import { TopicMapReadyView } from "./topic-map-ready-view.component";
import { useTopicMapViewModel } from "./topic-map.view-model";

export function TopicMapView() {
  const { t } = useTranslation();

  const { slug } = useParams();

  const viewModel = useTopicMapViewModel(slug || "");

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingMap")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  if (!viewModel.data) {
    return <ContentNotFoundState label={t("map.notFound")} />;
  }

  return (
    <>
      <TopicMapProgressError error={viewModel.progressError} />
      <TopicMapReadyView data={viewModel.data} />
    </>
  );
}
