import { UIDialogAction } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicRelatedList } from "./topic-related-list.component";
import type { TopicRelatedDisclosureProps } from "./topic-related-disclosure-props.interface";

export function TopicRelatedDisclosure(props: TopicRelatedDisclosureProps) {
  const { t } = useTranslation();

  if (!props.topics.length) {
    return null;
  }

  return (
    <UIDialogAction label={t("topics.moreConnections")} title={t("topics.relatedTopics")}>
      <TopicRelatedList topics={props.topics} />
    </UIDialogAction>
  );
}
