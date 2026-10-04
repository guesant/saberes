import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicRelatedLink } from "./topic-related-link.component";
import type { TopicRelatedListProps } from "./topic-related-list-props.type";

export function TopicRelatedList(props: TopicRelatedListProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="list">
      <UITypography variant="h5">{t("topics.relatedTopics")}</UITypography>
      <UIList>
        {props.topics.map((topic) => {
          return <TopicRelatedLink key={String(topic.slug)} topic={topic} />;
        })}
      </UIList>
    </UIContentGroup>
  );
}
