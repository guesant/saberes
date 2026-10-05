import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { PersonalProgressSummary } from "./personal-progress-summary.component";
import type { PersonalProgressStateViewProps } from "./personal-progress-state-view-props.interface";

export function PersonalProgressStateView(props: PersonalProgressStateViewProps) {
  const { t } = useTranslation();

  if (props.progress.state === "loading") {
    return <ContentLoadingState label={t("personal.progress.loading")} />;
  }

  if (props.progress.state === "error") {
    return (
      <ContentErrorState
        error={props.progress.error}
        label={t("personal.progress.loadError")}
        onRetry={props.progress.reload}
      />
    );
  }

  return <PersonalProgressSummary data={props.progress.data} />;
}
