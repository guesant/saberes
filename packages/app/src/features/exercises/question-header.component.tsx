import { UIContentGroup, UIQuestionStatement, UITypography } from "@guesant/saberes-ui";
import type { QuestionReadModel } from "@guesant/saberes-application";

export type QuestionHeaderProps = {
  data: QuestionReadModel;
};

export function QuestionHeader(props: QuestionHeaderProps) {
  const { question } = props.data;

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h4">{String(question.number || "")}</UITypography>
      <UIQuestionStatement>{String(question.statement || "")}</UIQuestionStatement>
    </UIContentGroup>
  );
}
