import { UICard, UICardContent, UIChip, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type TopicMapSummaryProps = {
  nodeCount: number;
  edgeCount: number;
};

export function TopicMapSummary(props: TopicMapSummaryProps) {
  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>
        <UITypography variant="h6">{t("map.structure")}</UITypography>

        <UIInlineActions>
          <UIChip label={t("map.topicsCount", { count: props.nodeCount })} />

          <UIChip label={t("map.relationsCount", { count: props.edgeCount })} />
        </UIInlineActions>

        <UITypography color="text.secondary">{t("map.description")}</UITypography>
      </UICardContent>
    </UICard>
  );
}
