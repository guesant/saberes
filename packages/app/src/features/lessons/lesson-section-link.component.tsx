import { UIListItemButton, UIListItemText } from "@guesant/saberes-ui";

export type LessonSectionLinkProps = {
  section: Record<string, unknown>;
  index: number;
  selected: boolean;
  onSelect(sectionIndex: number): Promise<void>;
};

export function LessonSectionLink(props: LessonSectionLinkProps) {
  const { section, index } = props;

  return (
    <UIListItemButton
      component="a"
      href={`#section-${String(section.id)}`}
      selected={props.selected}
      onClick={() => props.onSelect(props.index)}
    >
      <UIListItemText primary={`${index + 1}. ${String(section.title || "Conteúdo")}`} />
    </UIListItemButton>
  );
}
