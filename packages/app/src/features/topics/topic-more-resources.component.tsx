import { UIList, UIDialogAction } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicResourceLink } from "./topic-resource-link.component";
import type { TopicResourceReadModel } from "@guesant/saberes-application";

export interface TopicMoreResourcesProps {
  resources: TopicResourceReadModel[];
}

export function TopicMoreResources(props: TopicMoreResourcesProps) {
  const { t } = useTranslation();

  return (
    <UIDialogAction label={t("discovery.moreMaterials", { count: props.resources.length })} title={t("discovery.materials")}>
      <UIList>{props.resources.map((resource) => { return <TopicResourceLink key={resource.id} resource={resource} />; })}</UIList>
    </UIDialogAction>
  );
}
