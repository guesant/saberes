import { TopicLessonList } from "./topic-lesson-list.component";
import { TopicQuestionList } from "./topic-question-list.component";
import { TopicResourceList } from "./topic-resource-list.component";
import { TopicSectionPanel } from "./topic-section-panel.component";
import type { TopicSectionPanelsProps } from "./topic-section-panels-props.interface";
import type { ReactElement } from "react";

const sectionIds = ["teoria", "pratica", "materiais"] as const;

export function TopicSectionPanels(props: TopicSectionPanelsProps) {
  const content: ReactElement[] = [
    <TopicLessonList key="teoria" lessons={props.lessons} />,
    <TopicQuestionList key="pratica" questions={props.questions} />,
    <TopicResourceList key="materiais" resources={props.resources} />,
  ];

  return content.map((item, index) => {
    return (
      <TopicSectionPanel
        active={props.activeSection === index}
        content={item}
        id={`painel-${sectionIds[index]}`}
        key={sectionIds[index]}
        labelledBy={`aba-${sectionIds[index]}`}
      />
    );
  });
}
