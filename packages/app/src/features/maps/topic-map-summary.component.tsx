import { Card, CardContent, Chip, Stack, Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type TopicMapSummaryProps = {
  nodeCount: number;
  edgeCount: number;
};

export function TopicMapSummary(props: TopicMapSummaryProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{t("map.structure")}</Typography>

        <Stack direction="row" spacing={1}>
          <Chip label={t("map.topicsCount", { count: props.nodeCount })} />

          <Chip label={t("map.relationsCount", { count: props.edgeCount })} />
        </Stack>

        <Typography color="text.secondary">{t("map.description")}</Typography>
      </CardContent>
    </Card>
  );
}
