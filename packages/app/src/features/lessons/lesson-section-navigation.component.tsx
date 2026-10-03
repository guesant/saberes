import { List } from "@guesant/saberes-ui";
import { LessonSectionLink } from "./lesson-section-link.component";

export type LessonSectionNavigationProps = {
  sections: Array<Record<string, unknown>>;
};

export function LessonSectionNavigation(props: LessonSectionNavigationProps) {
  return (
    <List dense>
      {props.sections.map((section, index) => (
        <LessonSectionLink key={String(section.id)} section={section} index={index} />
      ))}
    </List>
  );
}
