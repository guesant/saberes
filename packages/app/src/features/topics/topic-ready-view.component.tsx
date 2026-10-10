import { UIContentGroup, UIFocusedContent } from "@guesant/saberes-ui";
import { TopicHeader } from "./topic-header.component";
import { TopicNavigationDisclosure } from "./topic-navigation-disclosure.component";
import { TopicRelatedDisclosure } from "./topic-related-disclosure.component";
import { TopicSectionPanels } from "./topic-section-panels.component";
import { useTopicSectionNavigation } from "./use-topic-section-navigation.hook";
import type { TopicReadyViewProps } from "./topic-ready-view-props.type";

export function TopicReadyView(props: TopicReadyViewProps) {
  const { activeSection, navigateToSection } = useTopicSectionNavigation();

  return (
    <UIFocusedContent>
      <UIContentGroup variant="section">
        <TopicHeader
          activeSection={activeSection}
          navigateToSection={navigateToSection}
          curriculum={props.data.curriculum}
          topic={props.data.topic}
        />
        <TopicSectionPanels
          activeSection={activeSection}
          lessons={props.data.lessons}
          questions={props.data.questions}
          resources={props.data.resources}
        />
        <TopicNavigationDisclosure
          childrenTopics={props.data.children}
          prerequisites={props.data.prerequisites}
        />
        <TopicRelatedDisclosure topics={props.data.related} />
      </UIContentGroup>
    </UIFocusedContent>
  );
}
