import { UITypography } from "@guesant/saberes-ui";
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
      <UITypography variant="overline">{t("map.eyebrow")}</UITypography>

      <UITypography variant="h3">{String(data.map.title)}</UITypography>

      <UITypography color="text.secondary">{String(data.map.description || "")}</UITypography>

      <TopicMapColumns data={data} />
    </>
  );
}
