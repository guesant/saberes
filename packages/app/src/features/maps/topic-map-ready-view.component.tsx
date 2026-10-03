import { Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicMapColumns } from "./topic-map-columns.component";
import type { TopicMapReadModel } from "@guesant/saberes-application";

export type TopicMapReadyViewProps = {
  data: TopicMapReadModel;
};

export function TopicMapReadyView(props: TopicMapReadyViewProps) {
  const { data } = props;

  const { t } = useTranslation();

  return (
    <>
      <Typography variant="overline">{t("map.eyebrow")}</Typography>

      <Typography variant="h3">{String(data.map.title)}</Typography>

      <Typography color="text.secondary">{String(data.map.description || "")}</Typography>

      <TopicMapColumns data={data} />
    </>
  );
}
