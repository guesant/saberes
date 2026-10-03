import { Box, Typography } from "@guesant/saberes-ui";
import { ContentRenderer } from "@guesant/saberes-ui-content";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import type { LessonSectionContentViewModel } from "./lesson-section-content-view-model.type";

export type LessonSectionContentViewProps = {
  viewModel: LessonSectionContentViewModel;
  onQuestion: (questionId: string | number) => void;
};

export function LessonSectionContentView(props: LessonSectionContentViewProps) {
  const { viewModel, onQuestion } = props;

  if (viewModel.status === "loading") {
    return <ContentLoadingState />;
  }

  if (viewModel.status === "error") {
    return <ContentErrorState error={viewModel.error} />;
  }

  if (viewModel.status === "invalid") {
    return <ContentErrorState error={viewModel.message} />;
  }

  return (
    <Box id={`section-${viewModel.sectionId}`}>
      <Typography variant="h4">{viewModel.title}</Typography>

      <ContentRenderer
        markdown={viewModel.markdown}
        blocks={viewModel.blocks}
        knowledgeGraph={viewModel.knowledgeGraph}
        onQuestion={onQuestion}
      />
    </Box>
  );
}
