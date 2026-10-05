import { UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicRelatedList } from "./topic-related-list.component";
import type { TopicRelatedDisclosureProps } from "./topic-related-disclosure-props.interface";

export function TopicRelatedDisclosure(props: TopicRelatedDisclosureProps) {
  const { t } = useTranslation();

  if (!props.topics.length) {
    return null;
  }

  return (
    <UIDisclosure summary={t("topics.moreConnections")}>
      <TopicRelatedList topics={props.topics} />
    </UIDisclosure>
  );
}
