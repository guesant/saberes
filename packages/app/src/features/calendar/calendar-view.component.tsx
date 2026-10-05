import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { CalendarReadyView } from "./calendar-ready-view.component";
import { useCalendarViewModel } from "./calendar.view-model";

export function CalendarView() {
  const { t } = useTranslation();

  const viewModel = useCalendarViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("calendar.loading")} />;
  }

  if (viewModel.state === "error") {
    return (
      <ContentErrorState
        error={viewModel.error}
        label={t("calendar.loadError")}
        onRetry={viewModel.reload}
      />
    );
  }

  return <CalendarReadyView viewModel={viewModel} />;
}
