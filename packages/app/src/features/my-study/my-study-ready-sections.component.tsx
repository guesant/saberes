import { UIContentGroup, UISectionAnchor } from "@guesant/saberes-ui";
import { ContentReleaseSummary } from "./content-release-summary.component";
import { LocalBackupPanel } from "./local-backup-panel.component";
import { MyStudyFirstStudyPrompt } from "./my-study-first-study-prompt.component";
import { MyStudyReadyOptionalContent } from "./my-study-ready-optional-content.component";
import { MyStudySavedContent } from "./my-study-saved-content.component";
import { MyStudySessionHistory } from "./my-study-session-history.component";
import type { LocalBackupViewModel } from "./local-backup-view-model.interface";
import type { MyStudyFeatureVisibility } from "./my-study-feature-visibility.interface";
import type { MyStudyViewModel } from "./my-study.view-model";

export interface MyStudyReadySectionsProps {
  viewModel: MyStudyViewModel;
  visibility: MyStudyFeatureVisibility;
  backupViewModel: LocalBackupViewModel;
}

export function MyStudyReadySections(props: MyStudyReadySectionsProps) {
  return (
    <UIContentGroup variant="section">
      <ContentReleaseSummary
        error={props.viewModel.contentReleaseError}
        release={props.viewModel.contentRelease}
      />
      <MyStudyFirstStudyPrompt
        course={props.viewModel.data.catalog.courses[0] || null}
        release={props.viewModel.contentRelease}
      />
      <UISectionAnchor id="dados-locais">
        <LocalBackupPanel viewModel={props.backupViewModel} />
      </UISectionAnchor>
      <MyStudySavedContent
        lessons={props.viewModel.data.savedLessons}
        questions={props.viewModel.data.savedQuestions}
      />
      <MyStudySessionHistory sessions={props.viewModel.data.sessions} />
      <MyStudyReadyOptionalContent
        course={props.viewModel.data.catalog.courses[0] || null}
        dailyQuestion={props.viewModel.data.dailyQuestion}
        reviewCount={props.viewModel.data.reviews.length}
        showRecommendations={props.visibility.showRecommendations}
        showReminders={props.visibility.showReminders}
      />
    </UIContentGroup>
  );
}
