import { UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicNavigationOptionalList } from "./topic-navigation-optional-list.component";
import type { TopicNavigationDisclosureProps } from "./topic-navigation-disclosure-props.interface";

export function TopicNavigationDisclosure(props: TopicNavigationDisclosureProps) {
  const { t } = useTranslation();

  if (!props.prerequisites.length && !props.childrenTopics.length) {
    return null;
  }

  return (
    <UIDisclosure summary={t("topics.navigation")}>
      <TopicNavigationOptionalList
        title={t("topics.prerequisites")}
        topics={props.prerequisites}
      />
      <TopicNavigationOptionalList title={t("topics.children")} topics={props.childrenTopics} />
    </UIDisclosure>
  );
}
