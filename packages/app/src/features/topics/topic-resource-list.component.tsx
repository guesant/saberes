import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicResourcePreview } from "./topic-resource-preview.component";
import type { TopicResourcePreviewProps } from "./topic-resource-preview.component";

export type TopicResourceListProps = TopicResourcePreviewProps;

export function TopicResourceList(props: TopicResourceListProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup id="materiais" variant="list">
      <UITypography variant="h5">{t("discovery.materials")}</UITypography>
      <TopicResourcePreview resources={props.resources} />
    </UIContentGroup>
  );
}
