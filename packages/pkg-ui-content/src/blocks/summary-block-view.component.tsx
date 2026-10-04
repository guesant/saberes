import { UIContentSurface, UIContentText } from "@guesant/saberes-ui";
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
      <UIContentText variant="heading">{block.title || t("content.summary")}</UIContentText>

      <UIContentText preserveWhitespace variant="body">
        {block.content}
      </UIContentText>
    </UIContentSurface>
  );
}
