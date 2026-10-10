import { UIChip, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { UIContentRenderer } from "@guesant/saberes-ui-content";
import { useTranslation } from "react-i18next";
import { QuestionSolutionSource } from "./question-solution-source.component";
import type { QuestionReadModel } from "@guesant/saberes-application";

export type QuestionSolutionItemProps = {
  solution: NonNullable<QuestionReadModel["solutions"]>[number];
};

const editorialStatusColors = {
  draft: "default",
  review: "warning",
  published: "success",
} as const;

export function QuestionSolutionItem(props: QuestionSolutionItemProps) {
  const { t } = useTranslation();

  const status = props.solution.editorialStatus ?? "published";

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h6">{props.solution.title}</UITypography>
      <UIInlineActions>
        <UIChip
          color={editorialStatusColors[status]}
          label={t(`editorial.status.${status}`)}
          size="small"
          variant="outlined"
        />
      </UIInlineActions>
      <UITypography variant="body2">{t("exercise.solutionEditorialNotice")}</UITypography>
      <UIContentRenderer markdown={props.solution.content} blocks={[]} showRichContent={false} />
      <QuestionSolutionSource url={props.solution.sourceUrl} title={props.solution.sourceTitle} />
    </UIContentGroup>
  );
}
