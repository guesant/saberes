import { UIList } from "@guesant/saberes-ui";
import { LessonSectionLink } from "./lesson-section-link.component";

export type LessonSectionNavigationProps = {
  sections: Array<Record<string, unknown>>;
  selectedIndex: number | undefined;
  onSectionSelect: (sectionIndex: number) => Promise<void>;
};

export function LessonSectionNavigation(props: LessonSectionNavigationProps) {
  return (
    <UIList dense>
      {props.sections.map((section, index) => (
        <LessonSectionLink
          key={String(section.id)}
          section={section}
          index={index}
          selected={props.selectedIndex === index}
          onSelect={props.onSectionSelect}
        />
      ))}
    </UIList>
  );
}
