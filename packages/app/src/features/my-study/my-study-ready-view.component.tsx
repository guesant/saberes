import { UIContentGroup } from "@guesant/saberes-ui";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getDefaultPreferences } from "../preferences/get-default-preferences.function";
import { usePreferencesQuery } from "../preferences/use-preferences-query.hook";
import { getMyStudyFeatureVisibility } from "./get-my-study-feature-visibility.function";
import { MyStudyHeader } from "./my-study-header.component";
import { MyStudyMetricsGrid } from "./my-study-metrics-grid.component";
import { MyStudyReadyFeedback } from "./my-study-ready-feedback.component";
import { MyStudyReadySections } from "./my-study-ready-sections.component";
import { useLocalBackupViewModel } from "./use-local-backup.view-model.hook";
import type { MyStudyViewModel } from "./my-study.view-model";

export type MyStudyReadyViewProps = {
  viewModel: MyStudyViewModel;
};

export function MyStudyReadyView(props: MyStudyReadyViewProps) {
  const { viewModel } = props;

  const services = useAppServices();

  const preferencesQuery = usePreferencesQuery(services);

  const preferences = preferencesQuery.data ?? getDefaultPreferences();

  const visibility = getMyStudyFeatureVisibility(preferences);

  const backupViewModel = useLocalBackupViewModel();

  return (
    <UIContentGroup variant="section">
      <MyStudyHeader />
      <MyStudyReadyFeedback
        catalogError={viewModel.catalogError}
        onRetry={viewModel.reload}
        progressError={viewModel.progressError}
      />
      <MyStudyMetricsGrid data={viewModel.data} showGamification={visibility.showGamification} />
      <MyStudyReadySections
        backupViewModel={backupViewModel}
        viewModel={viewModel}
        visibility={visibility}
      />
    </UIContentGroup>
  );
}
