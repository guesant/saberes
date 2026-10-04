import { UIContentGroup } from "@guesant/saberes-ui";
import { LessonSectionContent } from "./lesson-section-content.component";

export type LessonSectionsProps = {
  sections: Array<Record<string, unknown>>;
  onQuestion(questionId: string | number): void;
};

export function LessonSections(props: LessonSectionsProps) {
  return (
    <UIContentGroup variant="list">
      {props.sections.map((section) => {
        return (
          <LessonSectionContent
            key={String(section.id)}
            section={section}
            onQuestion={props.onQuestion}
          />
        );
      })}
    </UIContentGroup>
  );
}
