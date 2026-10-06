import { UIContentGroup, UIContentSurface, UIContentText } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { SummaryBlock } from "@guesant/saberes-application";

type UISummaryBlockViewProps = {
  block: SummaryBlock;
};

export function UISummaryBlockView(props: UISummaryBlockViewProps) {
  const { block } = props;

  const { t } = useTranslation();

  return (
    <UIContentSurface mode="summary">
      <UIContentGroup variant="tight">
        <UIContentText variant="heading">{block.title || t("content.summary")}</UIContentText>

        <UIContentText preserveWhitespace variant="body">
          {block.content}
        </UIContentText>
      </UIContentGroup>
    </UIContentSurface>
  );
}
